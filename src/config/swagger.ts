import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/*.js']; // נתיבי הקבצים שלך

const doc = {
  info: {
    title: 'My API',
    version: '1.0.0',
  },
};

const generateSwagger = async () => {
  try {
    const result = await swaggerAutogen(outputFile, endpointsFiles, doc);
    console.log('Swagger file generated successfully!');
  } catch (error) {
    console.error('Error generating Swagger file:', error);
  }
};

generateSwagger();

export const swaggerDocument = doc;
