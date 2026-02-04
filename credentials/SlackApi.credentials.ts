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
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SlackApi implements ICredentialType {
	name = 'slackApi';
	displayName = 'Slack API';
	documentationUrl = 'https://api.slack.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Bot User OAuth Token',
			name: 'botToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Bot User OAuth Token (starts with xoxb-)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{$credentials.botToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://slack.com/api',
			url: '/auth.test',
			method: 'POST',
		},
	};
}