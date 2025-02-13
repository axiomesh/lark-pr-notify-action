import {context} from '@actions/github'
import * as httpm from '@actions/http-client'
import * as core from '@actions/core'

interface message {
    msgtype: string
    markdown: markdown
    at: at
}

interface markdown {
    title: string
    text: string
}

interface at {
    atMobiles: string[]
    atUserIds: string[]
    atAll: boolean
}

interface dingtalkResponse {
    errcode: number
    errmsg: string
}

function generateAt(
    contentWorkflowsStatus: string,
    phoneNums: string[]
): {contentAt: string; paramAt: at} {
    let contentAt = ''
    const paramAt = {
        atMobiles: [] as string[],
        atUserIds: [] as string[],
        atAll: false
    }
    switch (contentWorkflowsStatus.toLowerCase()) {
        case 'success':
            contentAt = '审核人：'.toString()
            break
        default:
            contentAt = '创建人：'.toString()
    }
    for (const number of phoneNums) {
        contentAt = contentAt + `@${number} `.toString()
        paramAt.atMobiles.push(number)
    }
    return {contentAt, paramAt}
}

export function generateMessage(
    notificationTitle: string,
    users: string,
    reviewers: string,
    contentWorkflowsStatus: string
): message | undefined {
    reviewers = reviewers.trim()
    users = users.trim()
    const contentPRUrl = context.payload.pull_request?.html_url || ''
    contentWorkflowsStatus = contentWorkflowsStatus.toUpperCase()
    const contentPRTitle = context.payload.pull_request?.title
    let contentWorkflowsStatusColor
    switch (contentWorkflowsStatus) {
        case 'SUCCESS':
            contentWorkflowsStatusColor = 'green'
            break
        default:
            contentWorkflowsStatusColor = 'red'
    }

    let openIDs: string[] = []
    // success, notify reviewers
    if (contentWorkflowsStatus === 'SUCCESS') {
        openIDs = reviewers.split(',').map((word) => word.trim()).filter(elm => elm)
    } else {
        // fail, notify creator
        const userArr = users.split(',')
        for (const user of userArr) {
            const userMapping = user.split(':').map((word) => word.trim()).filter(elm => elm)
            if (userMapping.length !== 2) {
                throw new Error('the secret users is error, perhaps not split by ":"')
            }
            if (userMapping[0] === context.actor) {
                openIDs.push(userMapping[1])
                break
            }
        }
        // pr's actor is not in users, skip notify
        if (openIDs.length === 0) {
            core.info('no this user in secret users, skip notify')
            return
        }
    }
    const contentAt = generateAt(contentWorkflowsStatus, openIDs)
    const prContent =
        `Pull Request：[${contentPRTitle}](${contentPRUrl})\n\n${contentAt.contentAt}\n工作流状态：<font color='${contentWorkflowsStatusColor}'>${contentWorkflowsStatus}</font>\n![screenshot](https://i0.wp.com/saixiii.com/wp-content/uploads/2017/05/github.png?fit=573%2C248&ssl=1)\n`.toString()

    const msgCard: markdown = {
        title: notificationTitle,
        text: prContent
    }
    return {
        msgtype: 'markdown',
        markdown: msgCard,
        at: contentAt.paramAt
    }
}

export async function notify(webhook: string, msg: message): Promise<void> {
    const jsonStr = JSON.stringify(msg)
    const http = new httpm.HttpClient()
    const headers = {
        'Content-Type': 'application/json' // Set the correct Content-Type
    }
    const response = await http.post(webhook, jsonStr, headers)
    if (response.message.statusCode !== httpm.HttpCodes.OK) {
        throw new Error(
            `send request to webhook error, status code is ${response.message.statusCode}`
        )
    }
    const body = await response.readBody()
    const dingtalkResp: dingtalkResponse = JSON.parse(body)
    if (dingtalkResp.errcode !== 0) {
        throw new Error(
            `send request to webhook error, err msg is ${dingtalkResp.errmsg}`
        )
    }
}
