export const awsConfig = {
	API:{
		endpoints: [
            {
                name: process.env.API_ENDPOINT_NAME,
                endpoint: process.env.API_ENDPOINT_URL,
                region: "ap-southeast-1"
            }
        ]
	},
	Auth:{
        identityPoolId: process.env.AUTH_POOL_ID,
        region: "ap-southeast-1"
    },
    Storage: {
        bucket: process.env.STORAGE_BUCKET,
        region: "ap-southeast-1",
        serverSideEncryption: 'aws:kms',
        customPrefix: {
            public:''
        },
    }
}

export const languages = {
    "available": [
      {"name": "en", "code": "en"},
      {"name": "zh-cn", "code": "zh-cn"},
      {"name": "kk", "code": "kk"},
      {"name": "ru", "code": "ru"},
    ],
    "default": "en"
}