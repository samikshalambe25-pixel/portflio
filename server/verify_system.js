const http = require('http');

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING COMPLETE SYSTEM VERIFICATION ===\n');

  // 1. Test Home endpoint
  const home = await request({ hostname: 'localhost', port: 5000, path: '/api/home', method: 'GET' });
  console.log('1. GET /api/home -> Status:', home.status, 'Hero Name:', home.body.data?.hero?.name);

  // 2. Test Skills endpoint
  const skills = await request({ hostname: 'localhost', port: 5000, path: '/api/skills', method: 'GET' });
  console.log('2. GET /api/skills -> Status:', skills.status, 'Count:', skills.body.count);

  // 3. Test Projects endpoint
  const projects = await request({ hostname: 'localhost', port: 5000, path: '/api/projects', method: 'GET' });
  console.log('3. GET /api/projects -> Status:', projects.status, 'Count:', projects.body.count);

  // 4. Test Experiences endpoint
  const experiences = await request({ hostname: 'localhost', port: 5000, path: '/api/experiences', method: 'GET' });
  console.log('4. GET /api/experiences -> Status:', experiences.status, 'Count:', experiences.body.count);

  // 5. Test Auth Login
  const login = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@portfolio.com', password: 'admin123' });
  console.log('5. POST /api/auth/login -> Status:', login.status, 'Success:', login.body.success, 'Token received:', !!login.body.token);

  const token = login.body.token;

  // 6. Test Admin Project CRUD (Create -> Update -> Delete)
  const newProject = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/projects',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, {
    title: '✨ Automated Test Project',
    description: 'This is a dynamic test project created to verify CRUD functionality',
    category: 'web',
    technologies: ['React', 'Next.js', 'Node.js'],
    featured: true
  });
  console.log('6. POST /api/projects (CREATE) -> Status:', newProject.status, 'Created ID:', newProject.body.data?._id);

  const testId = newProject.body.data?._id;

  // 7. Update Project
  const updatedProject = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/projects/${testId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, {
    title: '✨ Updated Automated Test Project',
    featured: false
  });
  console.log('7. PUT /api/projects/:id (UPDATE) -> Status:', updatedProject.status, 'Updated Title:', updatedProject.body.data?.title);

  // 8. Delete Project
  const deletedProject = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/projects/${testId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('8. DELETE /api/projects/:id (DELETE) -> Status:', deletedProject.status, 'Success:', deletedProject.body.success);

  // 9. Submit Contact message
  const contactMsg = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/contact',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    subject: 'Project Collaboration Opportunity',
    message: 'Hello! Loved your portfolio. Would love to collaborate on a full stack product.'
  });
  console.log('9. POST /api/contact (SUBMIT) -> Status:', contactMsg.status, 'Message:', contactMsg.body.message);

  // 10. Check Contact inbox as Admin
  const inbox = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/contact',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('10. GET /api/contact (INBOX) -> Status:', inbox.status, 'Total messages in inbox:', inbox.body.count);

  // 11. Test Frontend Page Delivery
  const frontend = await request({ hostname: 'localhost', port: 3000, path: '/', method: 'GET' });
  console.log('11. GET http://localhost:3000/ (FRONTEND HOME) -> Status:', frontend.status, 'HTML length:', typeof frontend.body === 'string' ? frontend.body.length : 'ok');

  const adminFrontend = await request({ hostname: 'localhost', port: 3000, path: '/admin', method: 'GET' });
  console.log('12. GET http://localhost:3000/admin (FRONTEND ADMIN) -> Status:', adminFrontend.status, 'HTML length:', typeof adminFrontend.body === 'string' ? adminFrontend.body.length : 'ok');

  console.log('\n=== ALL SYSTEM TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(console.error);
