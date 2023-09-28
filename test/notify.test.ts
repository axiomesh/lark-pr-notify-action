import {test, describe} from '@jest/globals'
import {generateMessage, notify} from '../src/dingtalk';

jest.mock('@actions/github', () => ({
    context: {
        actor: process.env.NOTIFY_ACTION_ACTOR as string,
        payload: {
            pull_request: {
                html_url: process.env.NOTIFY_ACTION_GITHUB_URL as string,
                title: "mock test"
            }
        },
    },
}));

describe("test notification to dingtalk", () => {
    let webhook = process.env.NOTIFY_ACTION_WEBHOOK as string;
    let title = "GITHUB NOTIFICATION";
    let users = process.env.NOTIFY_ACTION_USERS as string;
    let reviewers = process.env.NOTIFY_ACTION_REVIEWERS as string;

    test("test generate success message", async () => {
        const msg = generateMessage(title, users, reviewers, "success");
        console.log(msg);
    })

    test("test generate fail message", async () => {
        const msg = generateMessage(title, users, reviewers, "fail");
        console.log(msg);
    })

    test("notify dingtalk success msg", async () => {
        const successMsg = generateMessage(title, users, reviewers, "success");
        if (successMsg) {
            notify(webhook, successMsg);
        }
    })

    test("notify dingtalk fail msg", async () => {
        const failMsg = generateMessage(title, users, reviewers, "fail");
        if (failMsg) {
            notify(webhook, failMsg);
        }
    })
})