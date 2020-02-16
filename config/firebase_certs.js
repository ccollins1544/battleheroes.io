const dotenv = require('dotenv').config('../.env');

exports.certs = {
  "type": process.env.FB_CERTS_type,
  "project_id": process.env.FB_CERTS_project_id,
  "private_key_id": process.env.FB_CERTS_private_key_id,
  "private_key": process.env.FB_CERTS_private_key.replace(/\\n/g, '\n'),
  "client_email": process.env.FB_CERTS_client_email,
  "client_id": process.env.FB_CERTS_client_id,
  "auth_uri": process.env.FB_CERTS_auth_uri,
  "token_uri": process.env.FB_CERTS_token_uri,
  "auth_provider_x509_cert_url": process.env.FB_CERTS_auth_provider_x509_cert_url,
  "client_x509_cert_url": process.env.FB_CERTS_client_x509_cert_url
}
