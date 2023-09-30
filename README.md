# Dingtalk-pr-notify-action-钉钉PR通知工作流

![build-test](https://github.com/zhecks/lark-pr-notify-action/actions/workflows/test.yml/badge.svg)

## 工作流用途

在提交PR后，通常需要等待工作流执行完成后才能进行合并。如果工作流的执行时间较长，开发者可能会忘记合并PR，这会导致PR合并的推迟并可能因此产生一系列问题。因此，有必要在工作流执行完成后，尽快进行PR的合并。

该工作流支持在其他工作流完成后，通过钉钉的webhook推送该事件的消息。

## 轮询逻辑

1. 若存在未结束的action，则继续轮询下一轮
2. 若出现失败的action，则终止轮询并进行通知PR创建人
3. 若所有的action都成功，则终止轮询并进行通知PR审计人

## 参数说明

带有<font color=red>*</font>为必填参数。

* **notification_title**: 通知的标题，默认是项目的名称

* **token**: github令牌，私有仓库必须，公共仓库也能通过令牌提升api调用次数

* **users<font color=red>*</font>**: github账户和钉钉用户手机号的映射关系，每个用户之前使用逗号分隔，用户名与手机号之间使用冒号分隔，e.g. "Alice:150xxxx,Bob:172xxxx"

* **reviewers<font color=red>*</font>**: 代码审计人的手机号，e.g. "132xxxx,178xxxx,139xxxx"

* **timeout**: 超时时间，默认是1800s

* **interval**: 轮询的间隔，工作流运行较快适当降低间隔，工作流较慢的适当提升间隔，默认15s

* **webhook<font color=red>*</font>**: 钉钉🤖的webhook地址

## yml示例

```yaml
jobs:
    notify:
        name: Dingtalk notify
        runs-on: ubuntu-latest
        if: always()
        needs: [base-check] # some pre-run jobs
        steps:
          - name: dingtalk notify
            uses: axiomesh/notify-action@master
            with:
                users: ${{ secrets.USERS }}
                reviewers: ${{ secrets.REVIEWERS }}
                webhook: ${{ secrets.WEBHOOK }}
                token: ${{ secrets.TOKEN }}
                # timeout: 8 minutes
                timeout: 480
                job_name: dingtalk notify
```
