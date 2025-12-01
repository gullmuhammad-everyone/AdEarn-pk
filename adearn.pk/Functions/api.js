exports.handler = async (event, context) => {
  const path = event.path.replace(/\.netlify\/functions\/api/, '');
  
  // Health check
  if (path === '/health' && event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'OK',
        service: 'AdEarn.pk API',
        timestamp: new Date().toISOString()
      })
    };
  }
  
  // User registration
  if (path === '/auth/register' && event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      const { name, email, phone, password } = body;
      
      if (!name || !email || !phone || !password) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'All fields are required' })
        };
      }
      
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'User registered successfully',
          user: {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            phone,
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  }
  
  // Default response
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Endpoint not found' })
  };
};
