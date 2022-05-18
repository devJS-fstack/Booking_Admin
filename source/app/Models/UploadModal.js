require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const { google } = require('googleapis')

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

var fs = require('fs')
const path = require('path');
var that = module.exports = {
    setPublicFile: async (fileId) => {
        try {
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })
            const getUrl = await drive.files.get({
                fileId,
                fields: 'webViewLink'
            })
            return getUrl;
        } catch (error) {
            console.log(error)
        }
    },
    uploadFile: async (pathImg, type, name) => {
        try {
            const createFile = await drive.files.create({
                requestBody: {
                    name: name,
                    mineType: `image/${type}`
                },
                media: {
                    mineType: `image/${type}`,
                    body: fs.createReadStream(pathImg)
                }
            })
            const fileId = createFile.data.id;
            const getUrl = await that.setPublicFile(fileId);
            return getUrl.data;
        } catch (err) {
            console.log(err)
        }
    },

    deleteFile: () => {

    },

}