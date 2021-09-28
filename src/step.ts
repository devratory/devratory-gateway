enum StepType {
    MicroserviceCall,
    ExecuteCode,
    Switch,
    ReturnResult
}

export interface IStep {
    name: string;
    type: StepType;
    pattern: string | object;
    payload: IStepPayload;
}

interface IStepPayload {
    /**
     * each key in payload can either be:
     *  string - '{{request.body.firstName}}'
     *  StepPayload - { 
     *                  profile: { 
     *                      firstName: '{{request.body.firstName}}', // string
     *                      lastName: {
     *                         type: StepType.MicroserviceCall
     *                         pattern: '@category/get_all',
     *                         payload: {
     *                          status: 'active' // hardcoded string
     *                         }
     *                      } // IStep
     *                  } // IStepPayload
     *                }
     * 
     */
    [key: string]: string | IStep | IStepPayload;
}

export class Step {
    constructor(stepJSON: IStep) {
    }

    execute() {

    }
}