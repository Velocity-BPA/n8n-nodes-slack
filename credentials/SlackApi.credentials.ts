import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SlackApi implements ICredentialType {
	name = 'slackApi';
	displayName = 'Slack API';
	documentationUrl = 'https://api.slack.com/authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'Token Type',
			name: 'tokenType',
			type: 'options',
			options: [
				{
					name: 'Bot Token',
					value: 'bot',
					description: 'Bot token for app integrations (xoxb-)',
				},
				{
					name: 'User Token',
					value: 'user',
					description: 'User token for user actions (xoxp-)',
				},
			],
			default: 'bot',
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Slack bot token (xoxb-) or user token (xoxp-)',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://slack.com/api',
			description: 'The base URL for Slack API',
		},
	];
}