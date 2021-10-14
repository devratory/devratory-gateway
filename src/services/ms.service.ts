export const CREATE_EVENT_RESPONSE_MOCK = {
  status: 200,
  data: {
    startTime: new Date(),
    endTime: new Date(),
    booked: false,
    title: 'Lets smash',
  },
};

export const CREATE_GROUP_RESPONSE_MOCK = {
  status: 200,
  data: {
    id: 'new_group_id1',
  },
};

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
