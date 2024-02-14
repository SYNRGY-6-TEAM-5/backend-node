import * as firebase from 'firebase-admin'
import * as serviceAccount from "./firebase-service-account.json";
// add your firebase db url here
const params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
}

firebase.initializeApp({
    credential: firebase.credential.cert(params),
})

interface FirebaseAdmin {
    sendMulticastNotification(payload: {
        title: string;
        body: string;
        tokens: string[];
        data?: { [key: string]: string };
    }): Promise<firebase.messaging.BatchResponse>;
    sendUnicastNotification(payload: {
        title: string;
        body: string;
        token: string;
        data?: { [key: string]: string };
    }): Promise<firebase.messaging.MessagingDevicesResponse>;
}

const firebaseAdmin: FirebaseAdmin = {
    sendMulticastNotification: function (payload) {
        const message = {
            notification: {
                title: payload.title,
                body: payload.body
            },
            tokens: payload.tokens,
            data: payload.data || {}
        };
        return firebase.messaging().sendEachForMulticast(message);
    },
    sendUnicastNotification: async function (payload) {
        const message = {
            notification: {
                title: payload.title,
                body: payload.body
            },
            token: payload.token,
            data: payload.data || {}
        };
        return firebase.messaging().send(message) as unknown as firebase.messaging.MessagingDevicesResponse;
    }
};

export default firebaseAdmin;