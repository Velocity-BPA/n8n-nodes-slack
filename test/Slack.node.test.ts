/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Slack } from '../nodes/Slack/Slack.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Slack Node', () => {
  let node: Slack;

  beforeAll(() => {
    node = new Slack();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Slack');
      expect(node.description.name).toBe('slack');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Channel Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        oauthTokens: {
          access_token: 'test-token'
        }
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  it('should create a channel successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createChannel';
        case 'name': return 'test-channel';
        case 'is_private': return false;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
      channel: {
        id: 'C1234567890',
        name: 'test-channel'
      }
    });

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://slack.com/api/conversations.create'
      })
    );
  });

  it('should get channel information successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getChannel';
        case 'channel': return 'C1234567890';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
      channel: {
        id: 'C1234567890',
        name: 'test-channel'
      }
    });

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('conversations.info')
      })
    );
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createChannel';
        case 'name': return 'test-channel';
        case 'is_private': return false;
        default: return undefined;
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should list channels with filters', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'listChannels';
        case 'exclude_archived': return true;
        case 'types': return ['public_channel', 'private_channel'];
        case 'limit': return 50;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
      channels: []
    });

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('conversations.list')
      })
    );
  });

  it('should archive a channel', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'archiveChannel';
        case 'channel': return 'C1234567890';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true
    });

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://slack.com/api/conversations.archive'
      })
    );
  });

  it('should invite users to channel', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'inviteToChannel';
        case 'channel': return 'C1234567890';
        case 'users': return 'U1234567890,U0987654321';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true
    });

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://slack.com/api/conversations.invite'
      })
    );
  });
});

describe('Message Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ token: 'test-token' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should send message successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('sendMessage')
      .mockReturnValueOnce('#general')
      .mockReturnValueOnce('Hello World')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
      message: { ts: '1234567890.123456', text: 'Hello World' }
    });

    const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
  });

  it('should get messages successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMessages')
      .mockReturnValueOnce('#general')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(100);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
      messages: [{ ts: '1234567890.123456', text: 'Hello World' }]
    });

    const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('sendMessage');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('User Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				oauthTokens: { access_token: 'test-token' },
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should list users successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('listUsers')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(100)
			.mockReturnValueOnce(false);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
			members: [{ id: 'U123', name: 'testuser' }],
		});

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([
			{
				json: { ok: true, members: [{ id: 'U123', name: 'testuser' }] },
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should get user successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUser')
			.mockReturnValueOnce('U123')
			.mockReturnValueOnce(false);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
			user: { id: 'U123', name: 'testuser' },
		});

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([
			{
				json: { ok: true, user: { id: 'U123', name: 'testuser' } },
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should get user profile successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUserProfile')
			.mockReturnValueOnce('U123')
			.mockReturnValueOnce(false);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
			profile: { real_name: 'Test User' },
		});

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([
			{
				json: { ok: true, profile: { real_name: 'Test User' } },
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should update user profile successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateUserProfile')
			.mockReturnValueOnce('U123')
			.mockReturnValueOnce('{"real_name": "New Name"}');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
		});

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([
			{
				json: { ok: true },
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should get user by email successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUserByEmail')
			.mockReturnValueOnce('test@example.com');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
			user: { id: 'U123', profile: { email: 'test@example.com' } },
		});

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([
			{
				json: { ok: true, user: { id: 'U123', profile: { email: 'test@example.com' } } },
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should set user presence successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('setUserPresence')
			.mockReturnValueOnce('away');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
		});

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([
			{
				json: { ok: true },
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listUsers');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([
			{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listUsers');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeUserOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});

describe('File Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://slack.com/api',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('uploadFile operation', () => {
    it('should upload file successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('uploadFile')
        .mockReturnValueOnce('general')
        .mockReturnValueOnce('test content')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('test.txt')
        .mockReturnValueOnce('Test File');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        ok: true,
        file: { id: 'F123456789' },
      });

      const items = [{ json: {} }];
      const result = await executeFileOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://slack.com/api/files.upload',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
          channels: 'general',
          content: 'test content',
          filename: 'test.txt',
          title: 'Test File',
        },
        json: true,
      });

      expect(result[0].json).toEqual({
        ok: true,
        file: { id: 'F123456789' },
      });
    });

    it('should handle upload file error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('uploadFile');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Upload failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeFileOperations.call(mockExecuteFunctions, items);

      expect(result[0].json.error).toBe('Upload failed');
    });
  });

  describe('getFile operation', () => {
    it('should get file successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFile')
        .mockReturnValueOnce('F123456789')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(20);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        ok: true,
        file: { id: 'F123456789', name: 'test.txt' },
      });

      const items = [{ json: {} }];
      const result = await executeFileOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://slack.com/api/files.info',
        headers: {
          Authorization: 'Bearer test-token',
        },
        qs: {
          file: 'F123456789',
          limit: 20,
        },
        json: true,
      });

      expect(result[0].json).toEqual({
        ok: true,
        file: { id: 'F123456789', name: 'test.txt' },
      });
    });
  });

  describe('deleteFile operation', () => {
    it('should delete file successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteFile')
        .mockReturnValueOnce('F123456789');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        ok: true,
      });

      const items = [{ json: {} }];
      const result = await executeFileOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://slack.com/api/files.delete',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
          file: 'F123456789',
        },
        json: true,
      });

      expect(result[0].json).toEqual({ ok: true });
    });
  });
});

describe('Reaction Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://slack.com/api',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('addReaction operation', () => {
		it('should add reaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('addReaction')
				.mockReturnValueOnce('C1234567890')
				.mockReturnValueOnce('1609459200.123456')
				.mockReturnValueOnce('thumbsup');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ ok: true });

			const result = await executeReactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://slack.com/api/reactions.add',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: 'channel=C1234567890&timestamp=1609459200.123456&name=thumbsup',
			});
			expect(result).toHaveLength(1);
			expect(result[0].json.ok).toBe(true);
		});

		it('should handle API errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('addReaction')
				.mockReturnValueOnce('C1234567890')
				.mockReturnValueOnce('1609459200.123456')
				.mockReturnValueOnce('thumbsup');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ ok: false, error: 'channel_not_found' });

			await expect(
				executeReactionOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow();
		});
	});

	describe('removeReaction operation', () => {
		it('should remove reaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('removeReaction')
				.mockReturnValueOnce('C1234567890')
				.mockReturnValueOnce('1609459200.123456')
				.mockReturnValueOnce('thumbsup');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ ok: true });

			const result = await executeReactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://slack.com/api/reactions.remove',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: 'channel=C1234567890&timestamp=1609459200.123456&name=thumbsup',
			});
			expect(result).toHaveLength(1);
			expect(result[0].json.ok).toBe(true);
		});
	});

	describe('getReactions operation', () => {
		it('should get reactions successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getReactions')
				.mockReturnValueOnce('C1234567890')
				.mockReturnValueOnce('1609459200.123456');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				ok: true,
				message: { reactions: [{ name: 'thumbsup', count: 2 }] },
			});

			const result = await executeReactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://slack.com/api/reactions.get?channel=C1234567890&timestamp=1609459200.123456',
				headers: {
					'Authorization': 'Bearer test-token',
				},
				json: true,
			});
			expect(result).toHaveLength(1);
			expect(result[0].json.ok).toBe(true);
		});
	});

	describe('listUserReactions operation', () => {
		it('should list user reactions successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listUserReactions')
				.mockReturnValueOnce('U1234567890')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(50);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				ok: true,
				items: [{ type: 'message', reaction: 'thumbsup' }],
			});

			const result = await executeReactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://slack.com/api/reactions.list?user=U1234567890&limit=50',
				headers: {
					'Authorization': 'Bearer test-token',
				},
				json: true,
			});
			expect(result).toHaveLength(1);
			expect(result[0].json.ok).toBe(true);
		});

		it('should handle errors gracefully when continueOnFail is true', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listUserReactions');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

			const result = await executeReactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Network error');
		});
	});
});

describe('Star Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        oauthTokens: { access_token: 'test-token' }
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should add star successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('addStar')
      .mockReturnValueOnce('C1234567890')
      .mockReturnValueOnce('1234567890.123456');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
    });

    const items = [{ json: {} }];
    const result = await executeStarOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://slack.com/api/stars.add',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'channel=C1234567890&timestamp=1234567890.123456',
      json: true,
    });
  });

  test('should remove star successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('removeStar')
      .mockReturnValueOnce('C1234567890')
      .mockReturnValueOnce('1234567890.123456');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
    });

    const items = [{ json: {} }];
    const result = await executeStarOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://slack.com/api/stars.remove',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'channel=C1234567890&timestamp=1234567890.123456',
      json: true,
    });
  });

  test('should list stars successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listStars')
      .mockReturnValueOnce('cursor123')
      .mockReturnValueOnce(50);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
      items: [{ type: 'message' }],
    });

    const items = [{ json: {} }];
    const result = await executeStarOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
    expect(result[0].json.items).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://slack.com/api/stars.list?cursor=cursor123&limit=50',
      headers: {
        'Authorization': 'Bearer test-token',
      },
      json: true,
    });
  });

  test('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('addStar');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeStarOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  test('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('addStar');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];

    await expect(executeStarOperations.call(mockExecuteFunctions, items))
      .rejects.toThrow('API Error');
  });
});

describe('Reminder Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				oauthTokens: { access_token: 'test-token' },
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should create reminder successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createReminder')
			.mockReturnValueOnce('Meeting in 1 hour')
			.mockReturnValueOnce('3600')
			.mockReturnValueOnce('U1234567890');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
			reminder: { id: 'Rm1234567890', text: 'Meeting in 1 hour' },
		});

		const result = await executeReminderOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.ok).toBe(true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://slack.com/api/reminders.add',
			}),
		);
	});

	it('should get reminder successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getReminder')
			.mockReturnValueOnce('Rm1234567890');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
			reminder: { id: 'Rm1234567890', text: 'Meeting in 1 hour' },
		});

		const result = await executeReminderOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.ok).toBe(true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: 'https://slack.com/api/reminders.info',
			}),
		);
	});

	it('should list reminders successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listReminders');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
			reminders: [
				{ id: 'Rm1234567890', text: 'Meeting in 1 hour' },
				{ id: 'Rm0987654321', text: 'Call client tomorrow' },
			],
		});

		const result = await executeReminderOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.ok).toBe(true);
		expect(result[0].json.reminders).toHaveLength(2);
	});

	it('should delete reminder successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteReminder')
			.mockReturnValueOnce('Rm1234567890');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
		});

		const result = await executeReminderOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.ok).toBe(true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://slack.com/api/reminders.delete',
			}),
		);
	});

	it('should complete reminder successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('completeReminder')
			.mockReturnValueOnce('Rm1234567890');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ok: true,
		});

		const result = await executeReminderOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.ok).toBe(true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://slack.com/api/reminders.complete',
			}),
		);
	});

	it('should handle API error', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listReminders');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('API Error'),
		);

		await expect(
			executeReminderOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API Error');
	});

	it('should continue on fail when enabled', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listReminders');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('API Error'),
		);

		const result = await executeReminderOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});
});

describe('User Group Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ oauthAccessToken: 'test-token' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  test('should create user group successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createUserGroup')
      .mockReturnValueOnce('Test Group')
      .mockReturnValueOnce('test-group')
      .mockReturnValueOnce('Test Description');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
      usergroup: { id: 'UG123', name: 'Test Group' }
    });

    const result = await executeUserGroupOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://slack.com/api/usergroups.create',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: { name: 'Test Group', handle: 'test-group', description: 'Test Description' },
      json: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
  });

  test('should list user groups successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listUserGroups')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
      usergroups: [{ id: 'UG123', name: 'Test Group' }]
    });

    const result = await executeUserGroupOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://slack.com/api/usergroups.list',
      headers: { 'Authorization': 'Bearer test-token' },
      qs: { include_users: true },
      json: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
  });

  test('should update user group successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateUserGroup')
      .mockReturnValueOnce('UG123')
      .mockReturnValueOnce('Updated Group')
      .mockReturnValueOnce('updated-group');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ok: true,
      usergroup: { id: 'UG123', name: 'Updated Group' }
    });

    const result = await executeUserGroupOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://slack.com/api/usergroups.update',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: { usergroup: 'UG123', name: 'Updated Group', handle: 'updated-group' },
      json: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0].json.ok).toBe(true);
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listUserGroups');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeUserGroupOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});
});
