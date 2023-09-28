import * as core from '@actions/core'
import {generateMessage, notify} from './dingtalk'
import {polling} from './wait'

async function run(): Promise<void> {
    try {
        core.info('waiting other actions...')
        const timeout = core.getInput('timeout')
        const interval = core.getInput('interval')
        const tk = core.getInput('token')
        const jobName = core.getInput('job_name')
        const status: string = await polling({
            token: tk,
            timeoutSeconds: parseInt(timeout, 10),
            intervalSeconds: parseInt(interval, 10),
            jobName
        })

        core.info(`the workflows status is ${status}`)
        const notificationTitle = core.getInput('notification_title')
        const users = core.getInput('users')
        const reviewers = core.getInput('reviewers')
        const msg = generateMessage(notificationTitle, users, reviewers, status)
        // need notify
        if (msg != null) {
            core.info('send notification to dingtalk')
            const webhook = core.getInput('webhook')
            await notify(webhook, msg)
        }
        core.info('finalize')
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()
