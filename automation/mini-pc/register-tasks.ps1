<#
    Register HomeStar's scheduled marketing tasks.

    Run from an Administrator PowerShell:
        .\register-tasks.ps1

    Idempotent - re-running replaces the tasks rather than creating duplicates, so it is
    also how you apply a change to a schedule. Nothing is published by registering; the
    tasks only run at their scheduled times.

    Only jobs that actually exist are registered. A scheduled task pointing at a job that
    has not been built yet fails every night, and a person who sees nightly failures soon
    stops reading them - which is exactly when a real failure goes unnoticed. As each new
    job from docs/automation-plan.md is built, add one Register-HomeStarTask line here.

    Remove everything this created:
        Get-ScheduledTask -TaskPath '\HomeStar\' | Unregister-ScheduledTask -Confirm:$false
#>

#Requires -RunAsAdministrator

$ErrorActionPreference = 'Stop'

# The repo root, derived from this script's own location rather than hard-coded, so a
# clone anywhere still registers correct paths.
$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$TaskPath = '\HomeStar\'

$python = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $python) {
    throw "python is not on PATH. Install Python 3.12+ with 'Add python.exe to PATH' ticked, then open a NEW terminal."
}

Write-Host ""
Write-Host "Repo:   $RepoRoot"
Write-Host "Python: $python"
Write-Host ""

function Register-HomeStarTask {
    param(
        [Parameter(Mandatory)] [string]   $Name,
        [Parameter(Mandatory)] [string]   $Script,      # repo-relative path
        [Parameter(Mandatory)] $Trigger,
        [Parameter(Mandatory)] [string]   $Description,
        # Browser jobs must run in a real logged-in desktop session. Run one without a
        # session and the browser window has no width or height, so pages lay out to
        # nothing and the job reads an empty screen while reporting success.
        [switch] $NeedsDesktop
    )

    $full = Join-Path $RepoRoot $Script
    if (-not (Test-Path $full)) { throw "Script not found: $full" }

    $action = New-ScheduledTaskAction -Execute $python `
                                      -Argument "`"$full`"" `
                                      -WorkingDirectory (Split-Path -Parent $full)

    $logonType = if ($NeedsDesktop) { 'Interactive' } else { 'S4U' }
    $principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" `
                                            -LogonType $logonType -RunLevel Limited

    # StartWhenAvailable so a job missed while the box was off still runs when it comes
    # back. The publisher decides for itself whether a late run is still appropriate.
    $settings = New-ScheduledTaskSettingsSet `
        -StartWhenAvailable `
        -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
        -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 10) `
        -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
        -MultipleInstances IgnoreNew

    if (Get-ScheduledTask -TaskName $Name -TaskPath $TaskPath -ErrorAction SilentlyContinue) {
        Unregister-ScheduledTask -TaskName $Name -TaskPath $TaskPath -Confirm:$false
        Write-Host "  replaced  $Name"
    } else {
        Write-Host "  created   $Name"
    }

    Register-ScheduledTask -TaskName $Name -TaskPath $TaskPath `
        -Action $action -Trigger $Trigger -Principal $principal `
        -Settings $settings -Description $Description | Out-Null
}

# ── Instagram reels ─────────────────────────────────────────────────────────
# Facebook's API can hold a scheduled reel; Instagram's cannot, so this is what fires at
# the right minute for Instagram. Daily rather than Mon/Fri: the script reads the queue,
# finds nothing due on other days, and exits. It also refuses to post a reel already on
# the account, so an extra run can never double-post.
Register-HomeStarTask `
    -Name        'InstagramReels' `
    -Script      'marketing\meta-ads\ig_publish.py' `
    -Trigger     (New-ScheduledTaskTrigger -Daily -At 9:00am) `
    -Description 'Publishes any reel due from marketing/meta-ads/ig-queue.json. Instagram cannot schedule; this is the scheduler.'

# ── Preflight ───────────────────────────────────────────────────────────────
# Weekly, so a stale token or an unreachable video is found on a Monday morning rather
# than discovered by a reel failing to appear.
Register-HomeStarTask `
    -Name        'Preflight' `
    -Script      'automation\mini-pc\check-setup.py' `
    -Trigger     (New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 8:00am) `
    -Description 'Checks the token is still valid and every queued reel is reachable. Read-only.'

Write-Host ""
Write-Host "Registered under Task Scheduler > HomeStar:"
Get-ScheduledTask -TaskPath $TaskPath | Select-Object TaskName, State | Format-Table -AutoSize

Write-Host "Run one now without waiting for its schedule:"
Write-Host "  Start-ScheduledTask -TaskName 'Preflight' -TaskPath '$TaskPath'"
Write-Host ""
Write-Host "A task showing 0x1 in Task Scheduler ran and exited non-zero. Task Scheduler"
Write-Host "never shows output - run the same script by hand to see the actual error."
Write-Host ""
