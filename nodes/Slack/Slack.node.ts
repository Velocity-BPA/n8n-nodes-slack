/*
 * Business Source License 1.1
 *
 * Copyright (c) 2024 Your Organization
 *
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://mariadb.com/bsl11/
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Slack implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Slack',
		name: 'slack',
		icon: 'file:slack.svg',
		group: ['communication'],
		version: 1,
		description: 'Consume Slack API',
		defaults: {
			name: 'Slack',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'slackApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Channel',
						value: 'channel',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'message',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Send a message to a channel',
						action: 'Send a message',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a message',
						action: 'Delete a message',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a message',
						action: 'Get a message',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many messages from a channel',
						action: 'Get many messages',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a message',
						action: 'Update a message',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['channel'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new channel',
						action: 'Create a channel',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get information about a channel',
						action: 'Get a channel',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many channels',
						action: 'Get many channels',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a channel',
						action: 'Update a channel',
					},
					{
						name: 'Archive',
						value: 'delete',
						description: 'Archive a channel',
						action: 'Archive a channel',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['create', 'getMany'],
					},
				},
				default: '',
				description: 'The channel to send the message to',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'The message text',
			},
			{
				displayName: 'Message Timestamp',
				name: 'ts',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['delete', 'get', 'update'],
					},
				},
				default: '',
				description: 'The timestamp of the message',
			},
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the channel',
			},
			{
				displayName: 'Channel Name',
				name: 'channelName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the channel to create',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				displayOptions: {
					show: {
						operation: ['getMany'],
					},
				},
				default: 100,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'message') {
					if (operation === 'create') {
						const channel = this.getNodeParameter('channel', i) as string;
						const text = this.getNodeParameter('text', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/chat.postMessage',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
									text,
								},
								json: true,
							},
						);
					} else if (operation === 'get') {
						const channel = this.getNodeParameter('channel', i) as string;
						const ts = this.getNodeParameter('ts', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'GET',
								url: `https://slack.com/api/conversations.history?channel=${channel}&latest=${ts}&limit=1&inclusive=true`,
								json: true,
							},
						);

						if (responseData.messages && responseData.messages.length > 0) {
							responseData = responseData.messages[0];
						}
					} else if (operation === 'getMany') {
						const channel = this.getNodeParameter('channel', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'GET',
								url: `https://slack.com/api/conversations.history?channel=${channel}&limit=${limit}`,
								json: true,
							},
						);

						responseData = responseData.messages || [];
					} else if (operation === 'update') {
						const channel = this.getNodeParameter('channel', i) as string;
						const ts = this.getNodeParameter('ts', i) as string;
						const text = this.getNodeParameter('text', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/chat.update',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
									ts,
									text,
								},
								json: true,
							},
						);
					} else if (operation === 'delete') {
						const channel = this.getNodeParameter('channel', i) as string;
						const ts = this.getNodeParameter('ts', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/chat.delete',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
									ts,
								},
								json: true,
							},
						);
					}
				} else if (resource === 'channel') {
					if (operation === 'create') {
						const channelName = this.getNodeParameter('channelName', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/conversations.create',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									name: channelName,
								},
								json: true,
							},
						);
					} else if (operation === 'get') {
						const channelId = this.getNodeParameter('channelId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'GET',
								url: `https://slack.com/api/conversations.info?channel=${channelId}`,
								json: true,
							},
						);

						responseData = responseData.channel;
					} else if (operation === 'getMany') {
						const limit = this.getNodeParameter('limit', i) as number;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'GET',
								url: `https://slack.com/api/conversations.list?limit=${limit}`,
								json: true,
							},
						);

						responseData = responseData.channels || [];
					} else if (operation === 'delete') {
						const channelId = this.getNodeParameter('channelId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/conversations.archive',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel: channelId,
								},
								json: true,
							},
						);
					}
				}

				if (Array.isArray(responseData)) {
					for (const item of responseData) {
						returnData.push({
							json: item,
							pairedItem: {
								item: i,
							},
						});
					}
				} else {
					returnData.push({
						json: responseData,
						pairedItem: {
							item: i,
						},
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}