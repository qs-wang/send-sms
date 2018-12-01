import {sendSMS} from '../../src/sms/sms';

describe('sms Api', () => {
  it('should send the sms', async ()=>{
    await sendSMS('12345', 
      'Hi, good deal at wwww.zab.com/deals'
    );
  });

  it('should send the sms with multiple urls', async ()=>{
    await sendSMS(process.env.BURST_TEST_PHONE, 
      'Hi, good deal at eclipse.org/birt, and http://www.eclipse.org/birt/about'
    );
  });
});