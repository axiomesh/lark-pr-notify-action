import * as core from '@actions/core'
import {generateMessage, notify} from './lark'
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
        const templateID = core.getInput('template_id')
        const notificationTitle = core.getInput('notification_title')
        const users = core.getInput('users')
        const reviewers = core.getInput('reviewers')
        const secret = core.getInput('secret')
        const msg = generateMessage(
            templateID,
            notificationTitle,
            users,
            reviewers,
            status,
            secret
        )
        // need notify
        if (msg != null) {
            core.info('send notification to lark')
            const webhook = core.getInput('webhook')
            await notify(webhook, msg)
        }
        core.info('finalize')
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()
