import axios from 'axios';

(async () => {
  try {
    const baseUrl = 'http://localhost:3000';

    console.log('Logging in with original password...');
    const login1 = await axios.post(`${baseUrl}/api/auth/login`, {
      email: 'admin@csec.com',
      password: 'admin1234'
    }, { headers: { 'Content-Type': 'application/json' } });

    console.log('Login1 response:', JSON.stringify(login1.data));
    const token = login1.data.accessToken;
    if (!token) {
      console.error('No accessToken returned');
      process.exit(1);
    }

    console.log('Changing password to admin1233...');
    const changeResp = await axios.post(`${baseUrl}/api/auth/change-password`, {
      oldPassword: 'admin1234',
      newPassword: 'admin1233'
    }, { headers: { Authorization: `Bearer ${token}` } });

    console.log('Change response:', JSON.stringify(changeResp.data));

    console.log('Logging in with new password...');
    const login2 = await axios.post(`${baseUrl}/api/auth/login`, {
      email: 'admin@csec.com',
      password: 'admin1233'
    }, { headers: { 'Content-Type': 'application/json' } });

    console.log('Login2 response:', JSON.stringify(login2.data));

    console.log('Test completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err.response?.data || err.message);
    process.exit(1);
  }
})();
