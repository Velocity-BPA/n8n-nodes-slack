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
	NodeApiError,
} from 'n8n-workflow';

export class Slack implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Slack',
		name: 'slack',
		icon: 'file:slack.svg',
		group: ['communication'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
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
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Reaction',
						value: 'reaction',
					},
					{
						name: 'Star',
						value: 'star',
					},
					{
						name: 'Reminder',
						value: 'reminder',
					},
					{
						name: 'User Group',
						value: 'userGroup',
					}
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
					{
						name: 'Send Ephemeral Message',
						value: 'sendEphemeralMessage',
						description: 'Send ephemeral message to user',
						action: 'Send ephemeral message',
					},
					{
						name: 'Schedule Message',
						value: 'scheduleMessage',
						description: 'Schedule a message',
						action: 'Schedule a message',
					},
					{
						name: 'Get Scheduled Messages',
						value: 'getScheduledMessages',
						description: 'List scheduled messages',
						action: 'Get scheduled messages',
					},
					{
						name: 'Delete Scheduled Message',
						value: 'deleteScheduledMessage',
						description: 'Delete scheduled message',
						action: 'Delete scheduled message',
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
					{
						name: 'Unarchive Channel',
						value: 'unarchiveChannel',
						description: 'Unarchive a channel',
						action: 'Unarchive a channel',
					},
					{
						name: 'Join Channel',
						value: 'joinChannel',
						description: 'Join a channel',
						action: 'Join a channel',
					},
					{
						name: 'Leave Channel',
						value: 'leaveChannel',
						description: 'Leave a channel',
						action: 'Leave a channel',
					},
					{
						name: 'Invite to Channel',
						value: 'inviteToChannel',
						description: 'Invite users to channel',
						action: 'Invite users to channel',
					},
					{
						name: 'Remove from Channel',
						value: 'removeFromChannel',
						description: 'Remove user from channel',
						action: 'Remove user from channel',
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
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'List Users',
						value: 'listUsers',
						description: 'Get list of workspace users',
						action: 'List users',
					},
					{
						name: 'Get User',
						value: 'getUser',
						description: 'Get user information',
						action: 'Get user',
					},
					{
						name: 'Get User Profile',
						value: 'getUserProfile',
						description: "Get user's profile information",
						action: 'Get user profile',
					},
					{
						name: 'Update User Profile',
						value: 'updateUserProfile',
						description: "Update user's profile",
						action: 'Update user profile',
					},
					{
						name: 'Get User by Email',
						value: 'getUserByEmail',
						description: 'Find user by email address',
						action: 'Get user by email',
					},
					{
						name: 'Set User Presence',
						value: 'setUserPresence',
						description: 'Set user presence',
						action: 'Set user presence',
					},
				],
				default: 'listUsers',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['file'] } },
				options: [
					{ name: 'Upload File', value: 'uploadFile', description: 'Upload a file to Slack', action: 'Upload file' },
					{ name: 'Get File', value: 'getFile', description: 'Get information about a file', action: 'Get file' },
					{ name: 'List Files', value: 'listFiles', description: 'List files in workspace', action: 'List files' },
					{ name: 'Delete File', value: 'deleteFile', description: 'Delete a file', action: 'Delete file' },
					{ name: 'Share File', value: 'shareFile', description: 'Share an existing file', action: 'Share file' },
					{ name: 'Add File Comment', value: 'addFileComment', description: 'Add comment to a file', action: 'Add file comment' }
				],
				default: 'uploadFile',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['reaction'],
					},
				},
				options: [
					{
						name: 'Add Reaction',
						value: 'addReaction',
						description: 'Add reaction to message',
						action: 'Add reaction to message',
					},
					{
						name: 'Remove Reaction',
						value: 'removeReaction',
						description: 'Remove reaction from message',
						action: 'Remove reaction from message',
					},
					{
						name: 'Get Reactions',
						value: 'getReactions',
						description: 'Get reactions for a message',
						action: 'Get reactions for a message',
					},
					{
						name: 'List User Reactions',
						value: 'listUserReactions',
						description: 'List reactions made by a user',
						action: 'List reactions made by a user',
					},
				],
				default: 'addReaction',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['star'] } },
				options: [
					{ name: 'Add Star', value: 'addStar', description: 'Star an item', action: 'Star an item' },
					{ name: 'Remove Star', value: 'removeStar', description: 'Remove star from item', action: 'Remove star from an item' },
					{ name: 'List Stars', value: 'listStars', description: 'List starred items', action: 'List starred items' }
				],
				default: 'addStar',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['reminder'],
					},
				},
				options: [
					{
						name: 'Create Reminder',
						value: 'createReminder',
						description: 'Create a reminder',
						action: 'Create reminder',
					},
					{
						name: 'Get Reminder',
						value: 'getReminder',
						description: 'Get reminder information',
						action: 'Get reminder',
					},
					{
						name: 'List Reminders',
						value: 'listReminders',
						description: 'List reminders',
						action: 'List reminders',
					},
					{
						name: 'Delete Reminder',
						value: 'deleteReminder',
						description: 'Delete a reminder',
						action: 'Delete reminder',
					},
					{
						name: 'Complete Reminder',
						value: 'completeReminder',
						description: 'Mark reminder as complete',
						action: 'Complete reminder',
					},
				],
				default: 'createReminder',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['userGroup'] } },
				options: [
					{ name: 'Create User Group', value: 'createUserGroup', description: 'Create a new user group', action: 'Create user group' },
					{ name: 'List User Groups', value: 'listUserGroups', description: 'List all user groups', action: 'List user groups' },
					{ name: 'Update User Group', value: 'updateUserGroup', description: 'Update an existing user group', action: 'Update user group' },
					{ name: 'Disable User Group', value: 'disableUserGroup', description: 'Disable a user group', action: 'Disable user group' },
					{ name: 'Enable User Group', value: 'enableUserGroup', description: 'Enable a user group', action: 'Enable user group' },
					{ name: 'Get User Group Users', value: 'getUserGroupUsers', description: 'List users in a group', action: 'Get user group users' },
					{ name: 'Update User Group Users', value: 'updateUserGroupUsers', description: 'Update group members', action: 'Update user group users' }
				],
				default: 'listUserGroups',
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
				displayName: 'Private',
				name: 'is_private',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['create']
					}
				},
				default: false,
				description: 'Whether to create a private channel'
			},
			{
				displayName: 'Exclude Archived',
				name: 'exclude_archived',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['getMany']
					}
				},
				default: false,
				description: 'Exclude archived channels from the list'
			},
			{
				displayName: 'Types',
				name: 'types',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['getMany']
					}
				},
				options: [
					{ name: 'Public Channels', value: 'public_channel' },
					{ name: 'Private Channels', value: 'private_channel' },
					{ name: 'Direct Messages', value: 'im' },
					{ name: 'Group Direct Messages', value: 'mpim' }
				],
				default: ['public_channel'],
				description: 'Types of conversations to include'
			},
			{
				displayName: 'New Name',
				name: 'newName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['update']
					}
				},
				default: '',
				description: 'New name for the channel'
			},
			{
				displayName: 'Users',
				name: 'users',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['inviteToChannel']
					}
				},
				default: '',
				description: 'Comma-separated list of user IDs to invite'
			},
			{
				displayName: 'User',
				name: 'user',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['removeFromChannel']
					}
				},
				default: '',
				description: 'User ID to remove from channel'
			},
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['channel'],
						operation: ['unarchiveChannel', 'joinChannel', 'leaveChannel', 'inviteToChannel', 'removeFromChannel']
					}
				},
				default: '',
				description: 'Channel ID or name'
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
			{
				displayName: 'Attachments',
				name: 'attachments',
				type: 'json',
				displayOptions: { show: { resource: ['message'], operation: ['create'] } },
				default: '',
				description: 'A JSON-based array of structured attachments',
			},
			{
				displayName: 'Blocks',
				name: 'blocks',
				type: 'json',
				displayOptions: { show: { resource: ['message'], operation: ['create', 'update'] } },
				default: '',
				description: 'A JSON-based array of structured blocks',
			},
			{
				displayName: 'User',
				name: 'user',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['message'], operation: ['sendEphemeralMessage'] } },
				default: '',
				description: 'User ID to send ephemeral message to',
			},
			{
				displayName: 'Post At',
				name: 'post_at',
				type: 'number',
				required: true,
				displayOptions: { show: { resource: ['message'], operation: ['scheduleMessage'] } },
				default: '',
				description: 'Unix EPOCH timestamp of time in future to send the message',
			},
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'string',
				displayOptions: { show: { resource: ['message'], operation: ['getMany', 'getScheduledMessages'] } },
				default: '',
				description: 'Pagination cursor for getting next set of messages',
			},
			{
				displayName: 'Scheduled Message ID',
				name: 'scheduled_message_id',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['message'], operation: ['deleteScheduledMessage'] } },
				default: '',
				description: 'ID of the scheduled message to delete',
			},
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				description: 'Paginate through collections of data by setting the cursor parameter to a next_cursor attribute',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['listUsers'],
					},
				},
			},
			{
				displayName: 'Include Locale',
				name: 'include_locale',
				type: 'boolean',
				default: false,
				description: 'Whether to include locale information in response',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['listUsers', 'getUser'],
					},
				},
			},
			{
				displayName: 'User ID',
				name: 'user',
				type: 'string',
				required: true,
				default: '',
				description: 'User to get info on',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUser', 'getUserProfile', 'updateUserProfile'],
					},
				},
			},
			{
				displayName: 'Include Labels',
				name: 'include_labels',
				type: 'boolean',
				default: false,
				description: 'Whether to include labels for fields that are suitable for presentation to users',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUserProfile'],
					},
				},
			},
			{
				displayName: 'Profile',
				name: 'profile',
				type: 'json',
				required: true,
				default: '{}',
				description: 'Collection of key:value pairs presented as a URL-encoded string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['updateUserProfile'],
					},
				},
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				default: '',
				description: 'Email address to lookup user by',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUserByEmail'],
					},
				},
			},
			{
				displayName: 'Presence',
				name: 'presence',
				type: 'options',
				required: true,
				options: [
					{
						name: 'Auto',
						value: 'auto',
					},
					{
						name: 'Away',
						value: 'away',
					},
				],
				default: 'auto',
				description: 'Either auto or away',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['setUserPresence'],
					},
				},
			},
			{
				displayName: 'Channels',
				name: 'channels',
				type: 'string',
				required: false,
				displayOptions: { show: { resource: ['file'], operation: ['uploadFile'] } },
				default: '',
				description: 'Comma-separated list of channel names or IDs where the file will be shared',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				required: false,
				displayOptions: { show: { resource: ['file'], operation: ['uploadFile'] } },
				default: '',
				description: 'File content via raw string',
			},
			{
				displayName: 'File',
				name: 'file',
				type: 'string',
				required: false,
				displayOptions: { show: { resource: ['file'], operation: ['uploadFile'] } },
				default: '',
				description: 'File to upload',
			},
			{
				displayName: 'Filename',
				name: 'filename',
				type: 'string',
				required: false,
				displayOptions: { show: { resource: ['file'], operation: ['uploadFile'] } },
				default: '',
				description: 'Filename of file',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: false,
				displayOptions: { show: { resource: ['file'], operation: ['uploadFile'] } },
				default: '',
				description: 'Title of file',
			},
			{
				displayName: 'File ID',
				name: 'fileId',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['file'], operation: ['getFile', 'deleteFile', 'shareFile', 'addFileComment'] } },
				default: '',
				description: 'Specify a file by providing its ID',
			},
			{
				displayName: 'Timestamp From',
				name: 'ts_from',
				type: 'string',
				required: false,
				displayOptions: { show: { resource: ['file'], operation: ['listFiles'] } },
				default: '',
				description: 'Filter files created after this timestamp',
			},
			{
				displayName: 'Timestamp To',
				name: 'ts_to',
				type: 'string',
				required: false,
				displayOptions: { show: { resource: ['file'], operation: ['listFiles'] } },
				default: '',
				description: 'Filter files created before this timestamp',
			},
			{
				displayName: 'Channels',
				name: 'shareChannels',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['file'], operation: ['shareFile'] } },
				default: '',
				description: 'Comma-separated list of channel IDs where the file will be shared',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['file'], operation: ['addFileComment'] } },
				default: '',
				description: 'Comment to add to the file',
			},
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reaction'],
						operation: ['addReaction', 'removeReaction', 'getReactions'],
					},
				},
				default: '',
				description: 'Channel ID where the message is located',
			},
			{
				displayName: 'Message Timestamp',
				name: 'timestamp',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reaction'],
						operation: ['addReaction', 'removeReaction', 'getReactions'],
					},
				},
				default: '',
				description: 'Timestamp of the message to react to',
			},
			{
				displayName: 'Emoji Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reaction'],
						operation: ['addReaction', 'removeReaction'],
					},
				},
				default: '',
				description: 'Name of emoji to add/remove (without colons)',
			},
			{
				displayName: 'User ID',
				name: 'user',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						resource: ['reaction'],
						operation: ['listUserReactions'],
					},
				},
				default: '',
				description: 'User ID to list reactions for (defaults to authenticated user)',
			},
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['star'],
						operation: ['addStar', 'removeStar']
					}
				},
				default: '',
				description: 'Channel, private group, or DM channel to star item in'
			},
			{
				displayName: 'Timestamp',
				name: 'timestamp',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['star'],
						operation: ['addStar', 'removeStar']
					}
				},
				default: '',
				description: 'Timestamp of the message to star'
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reminder'],
						operation: ['createReminder'],
					},
				},
				default: '',
				description: 'The content of the reminder',
			},
			{
				displayName: 'Time',
				name: 'time',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reminder'],
						operation: ['createReminder'],
					},
				},
				default: '',
				description: 'When this reminder should happen: the Unix timestamp (up to five years from now), the number of seconds until the reminder (if within 24 hours), or a natural language description',
			},
			{
				displayName: 'Reminder ID',
				name: 'reminder',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reminder'],
						operation: ['getReminder', 'deleteReminder', 'completeReminder'],
					},
				},
				default: '',
				description: 'The ID of the reminder',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['userGroup'], operation: ['createUserGroup'] } },
				default: '',
				description: 'Name of the user group',
			},
			{
				displayName: 'Handle',
				name: 'handle',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['userGroup'], operation: ['createUserGroup'] } },
				default: '',
				description: 'Handle for the user group (used in @mentions)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				displayOptions: { show: { resource: ['userGroup'], operation: ['createUserGroup'] } },
				default: '',
				description: 'Description of the user group',
			},
			{
				displayName: 'Include Disabled',
				name: 'include_disabled',
				type: 'boolean',
				displayOptions: { show: { resource: ['userGroup'], operation: ['listUserGroups', 'getUserGroupUsers'] } },
				default: false,
				description: 'Include disabled user groups',
			},
			{
				displayName: 'Include Users',
				name: 'include_users',
				type: 'boolean',
				displayOptions: { show: { resource: ['userGroup'], operation: ['listUserGroups'] } },
				default: false,
				description: 'Include list of users for each group',
			},
			{
				displayName: 'User Group ID',
				name: 'usergroup',
				type: 'string',
				required: true,
				displayOptions: { show: { resource: ['userGroup'], operation: ['updateUserGroup', 'disableUserGroup', 'enableUserGroup', 'getUserGroupUsers', 'updateUserGroupUsers'] } },
				default: '',
				description: 'The encoded ID of the user group',
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
				let responseData: any;

				if (resource === 'message') {
					if (operation === 'create') {
						const channel = this.getNodeParameter('channel', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const attachments = this.getNodeParameter('attachments', i, '') as string;
						const blocks = this.getNodeParameter('blocks', i, '') as string;

						const body: any = {
							channel,
							text,
						};

						if (attachments) {
							body.attachments = JSON.parse(attachments);
						}

						if (blocks) {
							body.blocks = JSON.parse(blocks);
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/chat.postMessage',
								headers: {
									'Content-Type': 'application/json',
								},
								body: body,
								json: true,
							},
						) as any;
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
						) as any;

						if (responseData.messages && responseData.messages.length > 0) {
							responseData = responseData.messages[0];
						}
					} else if (operation === 'getMany') {
						const channel = this.getNodeParameter('channel', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;
						const cursor = this.getNodeParameter('cursor', i, '') as string;

						let url = `https://slack.com/api/conversations.history?channel=${channel}&limit=${limit}`;
						if (cursor) {
							url += `&cursor=${cursor}`;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'GET',
								url: url,
								json: true,
							},
						) as any;

						responseData = responseData.messages || [];
					} else if (operation === 'update') {
						const channel = this.getNodeParameter('channel', i) as string;
						const ts = this.getNodeParameter('ts', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const blocks = this.getNodeParameter('blocks', i, '') as string;

						const body: any = {
							channel,
							ts,
							text,
						};

						if (blocks) {
							body.blocks = JSON.parse(blocks);
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/chat.update',
								headers: {
									'Content-Type': 'application/json',
								},
								body: body,
								json: true,
							},
						) as any;
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
						) as any;
					} else if (operation === 'sendEphemeralMessage') {
						const channel = this.getNodeParameter('channel', i) as string;
						const user = this.getNodeParameter('user', i) as string;
						const text = this.getNodeParameter('text', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/chat.postEphemeral',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
									user,
									text,
								},
								json: true,
							},
						) as any;
					} else if (operation === 'scheduleMessage') {
						const channel = this.getNodeParameter('channel', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const post_at = this.getNodeParameter('post_at', i) as number;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/chat.scheduleMessage',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
									text,
									post_at,
								},
								json: true,
							},
						) as any;
					} else if (operation === 'getScheduledMessages') {
						const channel = this.getNodeParameter('channel', i, '') as string;
						const cursor = this.getNodeParameter('cursor', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						let url = `https://slack.com/api/chat.scheduledMessages.list?limit=${limit}`;
						if (channel) {
							url += `&channel=${channel}`;
						}
						if (cursor) {
							url += `&cursor=${cursor}`;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'GET',
								url: url,
								json: true,
							},
						) as any;
					} else if (operation === 'deleteScheduledMessage') {
						const channel = this.getNodeParameter('channel', i) as string;
						const scheduled_message_id = this.getNodeParameter('scheduled_message_id', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/chat.deleteScheduledMessage',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
									scheduled_message_id,
								},
								json: true,
							},
						) as any;
					}
				} else if (resource === 'channel') {
					if (operation === 'create') {
						const channelName = this.getNodeParameter('channelName', i) as string;
						const isPrivate = this.getNodeParameter('is_private', i) as boolean;

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
									is_private: isPrivate,
								},
								json: true,
							},
						) as any;
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
						) as any;

						responseData = responseData.channel;
					} else if (operation === 'getMany') {
						const limit = this.getNodeParameter('limit', i) as number;
						const excludeArchived = this.getNodeParameter('exclude_archived', i) as boolean;
						const types = this.getNodeParameter('types', i) as string[];

						let url = `https://slack.com/api/conversations.list?limit=${limit}&exclude_archived=${excludeArchived}`;
						if (types.length > 0) {
							url += `&types=${types.join(',')}`;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'GET',
								url: url,
								json: true,
							},
						) as any;

						responseData = responseData.channels || [];
					} else if (operation === 'update') {
						const channelId = this.getNodeParameter('channelId', i) as string;
						const newName = this.getNodeParameter('newName', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/conversations.rename',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel: channelId,
									name: newName,
								},
								json: true,
							},
						) as any;
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
						) as any;
					} else if (operation === 'unarchiveChannel') {
						const channel = this.getNodeParameter('channel', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/conversations.unarchive',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
								},
								json: true,
							},
						) as any;
					} else if (operation === 'joinChannel') {
						const channel = this.getNodeParameter('channel', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/conversations.join',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
								},
								json: true,
							},
						) as any;
					} else if (operation === 'leaveChannel') {
						const channel = this.getNodeParameter('channel', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/conversations.leave',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
								},
								json: true,
							},
						) as any;
					} else if (operation === 'inviteToChannel') {
						const channel = this.getNodeParameter('channel', i) as string;
						const users = this.getNodeParameter('users', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/conversations.invite',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
									users,
								},
								json: true,
							},
						) as any;
					} else if (operation === 'removeFromChannel') {
						const channel = this.getNodeParameter('channel', i) as string;
						const user = this.getNodeParameter('user', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'slackApi',
							{
								method: 'POST',
								url: 'https://slack.com/api/conversations.kick',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									channel,
									user,
								},
								json: true,
							},
						) as any;
					}
				} else if (resource === 'user') {
					const credentials = await this.getCredentials('slackApi') as any;

					if (operation === 'listUsers') {
						const cursor = this.getNodeParameter('cursor', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;
						const include_locale = this.getNodeParameter('include_locale', i) as boolean;

						let url = `https://slack.com/api/users.list?limit=${limit}&include_locale=${include_locale}`;
						if (cursor) {
							url += `&cursor=${cursor}`;
						}

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: url,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							json: true,
						}) as any;
					} else if (operation === 'getUser') {
						const user = this.getNodeParameter('user', i) as string;
						const include_locale = this.getNodeParameter('include_locale', i) as boolean;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: `https://slack.com/api/users.info?user=${user}&include_locale=${include_locale}`,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							json: true,
						}) as any;
					} else if (operation === 'getUserProfile') {
						const user = this.getNodeParameter('user', i) as string;
						const include_labels = this.getNodeParameter('include_labels', i) as boolean;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: `https://slack.com/api/users.profile.get?user=${user}&include_labels=${include_labels}`,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							json: true,
						}) as any;
					} else if (operation === 'updateUserProfile') {
						const user = this.getNodeParameter('user', i) as string;
						const profile = this.getNodeParameter('profile', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/users.profile.set',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								user,
								profile,
							},
							json: true,
						}) as any;
					} else if (operation === 'getUserByEmail') {
						const email = this.getNodeParameter('email', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: `https://slack.com/api/users.lookupByEmail?email=${email}`,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							json: true,
						}) as any;
					} else if (operation === 'setUserPresence') {
						const presence = this.getNodeParameter('presence', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/users.setPresence',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								presence,
							},
							json: true,
						}) as any;
					}
				} else if (resource === 'file') {
					const credentials = await this.getCredentials('slackApi') as any;

					if (operation === 'uploadFile') {
						const channels = this.getNodeParameter('channels', i) as string;
						const content = this.getNodeParameter('content', i) as string;
						const file = this.getNodeParameter('file', i) as string;
						const filename = this.getNodeParameter('filename', i) as string;
						const title = this.getNodeParameter('title', i) as string;

						const body: any = {};
						if (channels) body.channels = channels;
						if (content) body.content = content;
						if (file) body.file = file;
						if (filename) body.filename = filename;
						if (title) body.title = title;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/files.upload',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: body,
							json: true,
						}) as any;
					} else if (operation === 'getFile') {
						const fileId = this.getNodeParameter('fileId', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: `https://slack.com/api/files.info?file=${fileId}`,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
							},
							json: true,
						}) as any;
					} else if (operation === 'listFiles') {
						const channel = this.getNodeParameter('channel', i, '') as string;
						const user = this.getNodeParameter('user', i, '') as string;
						const ts_from = this.getNodeParameter('ts_from', i, '') as string;
						const ts_to = this.getNodeParameter('ts_to', i, '') as string;

						let url = 'https://slack.com/api/files.list?';
						if (channel) url += `channel=${channel}&`;
						if (user) url += `user=${user}&`;
						if (ts_from) url += `ts_from=${ts_from}&`;
						if (ts_to) url += `ts_to=${ts_to}&`;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: url,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
							},
							json: true,
						}) as any;
					} else if (operation === 'deleteFile') {
						const fileId = this.getNodeParameter('fileId', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/files.delete',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: { file: fileId },
							json: true,
						}) as any;
					} else if (operation === 'shareFile') {
						const fileId = this.getNodeParameter('fileId', i) as string;
						const channels = this.getNodeParameter('shareChannels', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/files.share',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								file: fileId,
								channels: channels,
							},
							json: true,
						}) as any;
					} else if (operation === 'addFileComment') {
						const fileId = this.getNodeParameter('fileId', i) as string;
						const comment = this.getNodeParameter('comment', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: `https://slack.com/api/files.comments.add?file=${fileId}&comment=${comment}`,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
							},
							json: true,
						}) as any;
					}
				} else if (resource === 'reaction') {
					const credentials = await this.getCredentials('slackApi') as any;

					if (operation === 'addReaction') {
						const channel = this.getNodeParameter('channel', i) as string;
						const timestamp = this.getNodeParameter('timestamp', i) as string;
						const name = this.getNodeParameter('name', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/reactions.add',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								channel,
								timestamp,
								name,
							},
							json: true,
						}) as any;
					} else if (operation === 'removeReaction') {
						const channel = this.getNodeParameter('channel', i) as string;
						const timestamp = this.getNodeParameter('timestamp', i) as string;
						const name = this.getNodeParameter('name', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/reactions.remove',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								channel,
								timestamp,
								name,
							},
							json: true,
						}) as any;
					} else if (operation === 'getReactions') {
						const channel = this.getNodeParameter('channel', i) as string;
						const timestamp = this.getNodeParameter('timestamp', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: `https://slack.com/api/reactions.get?channel=${channel}&timestamp=${timestamp}`,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
							},
							json: true,
						}) as any;
					} else if (operation === 'listUserReactions') {
						const user = this.getNodeParameter('user', i, '') as string;
						const cursor = this.getNodeParameter('cursor', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						let url = `https://slack.com/api/reactions.list?limit=${limit}`;
						if (user) url += `&user=${user}`;
						if (cursor) url += `&cursor=${cursor}`;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: url,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
							},
							json: true,
						}) as any;
					}
				} else if (resource === 'star') {
					const credentials = await this.getCredentials('slackApi') as any;

					if (operation === 'addStar') {
						const channel = this.getNodeParameter('channel', i) as string;
						const timestamp = this.getNodeParameter('timestamp', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/stars.add',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								channel,
								timestamp,
							},
							json: true,
						}) as any;
					} else if (operation === 'removeStar') {
						const channel = this.getNodeParameter('channel', i) as string;
						const timestamp = this.getNodeParameter('timestamp', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/stars.remove',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								channel,
								timestamp,
							},
							json: true,
						}) as any;
					} else if (operation === 'listStars') {
						const cursor = this.getNodeParameter('cursor', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 20) as number;

						let url = `https://slack.com/api/stars.list?limit=${limit}`;
						if (cursor) {
							url += `&cursor=${cursor}`;
						}

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: url,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
							},
							json: true,
						}) as any;
					}
				} else if (resource === 'reminder') {
					const credentials = await this.getCredentials('slackApi') as any;

					if (operation === 'createReminder') {
						const text = this.getNodeParameter('text', i) as string;
						const time = this.getNodeParameter('time', i) as string;
						const user = this.getNodeParameter('user', i, '@me') as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/reminders.add',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								text,
								time,
								user,
							},
							json: true,
						}) as any;
					} else if (operation === 'getReminder') {
						const reminder = this.getNodeParameter('reminder', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: `https://slack.com/api/reminders.info?reminder=${reminder}`,
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
							},
							json: true,
						}) as any;
					} else if (operation === 'listReminders') {
						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: 'https://slack.com/api/reminders.list',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
							},
							json: true,
						}) as any;
					} else if (operation === 'deleteReminder') {
						const reminder = this.getNodeParameter('reminder', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/reminders.delete',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								reminder,
							},
							json: true,
						}) as any;
					} else if (operation === 'completeReminder') {
						const reminder = this.getNodeParameter('reminder', i) as string;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/reminders.complete',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: {
								reminder,
							},
							json: true,
						}) as any;
					}
				} else if (resource === 'userGroup') {
					const credentials = await this.getCredentials('slackApi') as any;

					if (operation === 'createUserGroup') {
						const name = this.getNodeParameter('name', i) as string;
						const handle = this.getNodeParameter('handle', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						const body: any = { name, handle };
						if (description) body.description = description;

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: 'https://slack.com/api/usergroups.create',
							headers: {
								'Authorization': `Bearer ${credentials.botToken}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							form: body,
							json: true,
						}) as any;
					} else if (operation === 'listUserGroups') {
						const includeDisabled = this.getNodeParameter('include_disabled', i) as boolean;
						const includeUsers = this