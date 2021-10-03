import { CREATE_EVENT_RESPONSE_MOCK, CREATE_GROUP_RESPONSE_MOCK } from './mocks';

const MOCKED_RESPONSES = {
  '@event/create': CREATE_EVENT_RESPONSE_MOCK,
  '@group/create': CREATE_GROUP_RESPONSE_MOCK,
};

class MSService {
  constructor() {}

  async call<T>(pattern: any, payload: any): Promise<T> {
    // Return mocked result by pattern
    return Promise.resolve(MOCKED_RESPONSES[pattern]);
  }
}

export const msService = new MSService();
