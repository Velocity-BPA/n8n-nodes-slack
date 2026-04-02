# n8n-nodes-slack

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Slack integration that provides access to 8 core resources including channels, messages, users, files, reactions, stars, reminders, and user groups. This node enables complete Slack workspace automation with robust message management, file operations, and team collaboration features.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Slack API](https://img.shields.io/badge/Slack%20API-Web%20API-4A154B)
![Real-time](https://img.shields.io/badge/Real--time-WebSocket-green)
![Team Collaboration](https://img.shields.io/badge/Team-Collaboration-purple)

## Features

- **Channel Management** - Create, update, archive channels and manage memberships across public and private channels
- **Message Operations** - Send, update, delete messages with rich formatting, attachments, and threading support
- **User Administration** - Retrieve user profiles, presence status, and manage user information across workspaces
- **File Management** - Upload, download, share, and delete files with comprehensive metadata and permissions
- **Reaction System** - Add, remove, and list emoji reactions on messages for enhanced communication
- **Star Operations** - Manage starred items including messages, files, and channels for quick access
- **Reminder Functionality** - Create, complete, and delete reminders for users and channels
- **User Group Control** - Create, update, enable/disable user groups and manage group memberships

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-slack`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-slack
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-slack.git
cd n8n-nodes-slack
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-slack
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Token | Slack Bot User OAuth Token (starts with `xoxb-`) | Yes |
| Base URL | Slack API base URL (usually `https://slack.com/api`) | No |

## Resources & Operations

### 1. Channel

| Operation | Description |
|-----------|-------------|
| Create | Create a new public or private channel |
| Get | Retrieve channel information and metadata |
| Get Many | List channels with filtering options |
| Update | Update channel name, topic, purpose, or settings |
| Archive | Archive a channel to make it read-only |
| Unarchive | Unarchive a previously archived channel |
| Join | Join an existing channel |
| Leave | Leave a channel |
| Invite | Invite users to a channel |
| Kick | Remove users from a channel |
| Get Members | List all members of a channel |

### 2. Message

| Operation | Description |
|-----------|-------------|
| Send | Send a message to a channel, user, or thread |
| Update | Edit an existing message |
| Delete | Delete a message |
| Get | Retrieve a specific message |
| Get Many | List messages from a channel with pagination |
| Reply | Reply to a message in a thread |
| Search | Search messages across channels |
| Pin | Pin a message to a channel |
| Unpin | Unpin a previously pinned message |
| Get Replies | Get all replies to a threaded message |

### 3. User

| Operation | Description |
|-----------|-------------|
| Get | Retrieve user profile information |
| Get Many | List users in the workspace |
| Get Presence | Check user's presence status |
| Set Presence | Set your own presence status |
| Get Profile | Get detailed user profile |
| Update Profile | Update user profile fields |
| List Conversations | Get user's channel and DM list |
| Set Status | Set user status message and emoji |
| Get Status | Get current user status |

### 4. File

| Operation | Description |
|-----------|-------------|
| Upload | Upload a file to Slack |
| Get | Retrieve file information and metadata |
| Get Many | List files with filtering options |
| Delete | Delete a file from Slack |
| Share | Share a file to channels or users |
| Get Info | Get detailed file information |
| Download | Download file content |
| Set Public | Make a file publicly accessible |
| Revoke Public | Revoke public access to a file |

### 5. Reaction

| Operation | Description |
|-----------|-------------|
| Add | Add an emoji reaction to a message |
| Remove | Remove an emoji reaction |
| Get | Get reactions for a specific message |
| List | List all reactions by a user |

### 6. Star

| Operation | Description |
|-----------|-------------|
| Add | Star a message, file, or channel |
| Remove | Remove a star from an item |
| Get Many | List all starred items |

### 7. Reminder

| Operation | Description |
|-----------|-------------|
| Create | Create a reminder for yourself or others |
| Get | Get information about a specific reminder |
| Get Many | List all reminders |
| Complete | Mark a reminder as complete |
| Delete | Delete a reminder |

### 8. User Group

| Operation | Description |
|-----------|-------------|
| Create | Create a new user group |
| Update | Update user group name or handle |
| Get Many | List all user groups |
| Enable | Enable a disabled user group |
| Disable | Disable a user group |
| Get Users | List users in a user group |
| Update Users | Add or remove users from a group |

## Usage Examples

```javascript
// Send a formatted message to a channel
{
  "channel": "#general",
  "text": "Hello team! 👋",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Project Update*\nThe API integration is now complete!"
      }
    }
  ]
}
```

```javascript
// Upload a file and share it to multiple channels
{
  "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "filename": "report.png",
  "title": "Weekly Report",
  "channels": ["#marketing", "#sales"],
  "initial_comment": "Here's this week's performance report"
}
```

```javascript
// Create a reminder for a team member
{
  "text": "Review quarterly budget proposal",
  "time": "2024-01-15T09:00:00Z",
  "user": "U1234567890"
}
```

```javascript
// Search for messages containing specific keywords
{
  "query": "budget approval from:@john.doe in:#finance",
  "sort": "timestamp",
  "sort_dir": "desc",
  "count": 20
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| `invalid_auth` | API token is invalid or expired | Verify token permissions and regenerate if necessary |
| `channel_not_found` | Specified channel does not exist | Check channel name/ID and bot's channel access |
| `not_in_channel` | Bot is not a member of the channel | Invite the bot to the channel first |
| `file_not_found` | File ID does not exist or is inaccessible | Verify file ID and check file permissions |
| `user_not_found` | User ID or username is invalid | Confirm user exists in workspace |
| `rate_limited` | API rate limit exceeded | Implement exponential backoff and retry logic |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-slack/issues)
- **Slack API Documentation**: [https://api.slack.com/](https://api.slack.com/)
- **Slack Community**: [https://slackcommunity.com/](https://slackcommunity.com/)