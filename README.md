# n8n-nodes-slack

Slack integration for n8n - A comprehensive node for interacting with the Slack API.

## Features

- **Messages**: Create, read, update, delete, and list messages
- **Channels**: Create, read, update, delete (archive), and list channels
- **Users**: Get user information and list users
- Full CRUD operations for supported resources

## Installation

### Community Nodes (Recommended)

1. In n8n, go to Settings > Community Nodes
2. Click "Install a community node"
3. Enter: `n8n-nodes-slack`
4. Click Install

### Manual Installation

1. Navigate to your n8n installation directory
2. Install the package:
   bash
   npm install n8n-nodes-slack
   
3. Restart n8n

## Configuration

### Slack App Setup

1. Go to [Slack API Console](https://api.slack.com/apps)
2. Create a new app or use an existing one
3. Go to "OAuth & Permissions"
4. Add the following Bot Token Scopes:
   - `chat:write` - Send messages
   - `chat:write.public` - Send messages to channels the bot isn't in
   - `channels:read` - View basic information about public channels
   - `channels:manage` - Manage public channels
   - `channels:history` - View messages in public channels
   - `groups:read` - View basic information about private channels
   - `groups:history` - View messages in private channels
   - `im:read` - View basic information about direct messages
   - `im:history` - View messages in direct messages
   - `mpim:read` - View basic information about group direct messages
   - `mpim:history` - View messages in group direct messages
5. Install the app to your workspace
6. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### n8n Credential Setup

1. In n8n, create a new credential of type "Slack API"
2. Paste your Bot User OAuth Token
3. Test the connection

## Usage

### Messages

- **Create**: Send a message to a channel
- **Get**: Retrieve a specific message by timestamp
- **Get Many**: Retrieve multiple messages from a channel
- **Update**: Edit an existing message
- **Delete**: Delete a message

### Channels

- **Create**: Create a new channel
- **Get**: Get information about a specific channel
- **Get Many**: List all channels
- **Update**: Update channel information
- **Archive**: Archive (delete) a channel

## Examples

### Send a Message

{
  "resource": "message",
  "operation": "create",
  "channel": "#general",
  "text": "Hello from n8n!"
}


### Create a Channel

{
  "resource": "channel",
  "operation": "create",
  "channelName": "my-new-channel"
}


### Get Messages from Channel

{
  "resource": "message",
  "operation": "getMany",
  "channel": "#general",
  "limit": 50
}


## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check that your Bot Token is correct and starts with `xoxb-`
2. **403 Forbidden**: Ensure your bot has the required scopes for the operation
3. **Channel not found**: Use channel ID (C1234567890) instead of channel name for better reliability
4. **Message not found**: Verify the message timestamp is correct and the message exists

### Debug Tips

- Enable "Always Output Data" in the node settings to see error responses
- Check the Slack API logs in your app settings
- Use channel IDs instead of names when possible

## License

This project is licensed under the Business Source License 1.1.

**Business Source License 1.1**

Copyright (c) 2024 Your Organization

Licensed under the Business Source License 1.1 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mariadb.com/bsl11/

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Support

For issues and feature requests, please open an issue on the [GitHub repository](https://github.com/your-org/n8n-nodes-slack).

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

---

**Note**: This is a community node and is not officially maintained by n8n or Slack. Use at your own discretion.