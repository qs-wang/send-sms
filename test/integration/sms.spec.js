import {sendSMS, sendSMSs} from '../../src/sms/sms';

describe('sms API integration test', () => {
  it('should send the sms with multiple urls', async ()=>{
    await sendSMS(process.env.BURST_TEST_PHONE, 
      'Hi, good deal at eclipse.org/birt, and http://www.eclipse.org/birt/about'
    );
  });

  it('should send the multiple messages with multiple urls', async ()=>{
    await sendSMSs(process.env.BURST_TEST_PHONE, [
      'Hi, good deal at eclipse.org/birt, and http://www.eclipse.org/birt/about',
      'Hi, take a look at amazon.com, and https://www.littlebird.com.au',
    ]
    );
  });
});