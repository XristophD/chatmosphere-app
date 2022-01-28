window._env_ = {
  connectionOptions: {
    serviceUrl: "${CONNECTION_OPTIONS_SERVICE_URL}", // XMPP service URL
    hosts: {
      domain: "${CONNECTION_OPTIONS_HOSTS_DOMAIN}",
      muc: "${CONNECTION_OPTIONS_HOSTS_MUC}",
      // anonymousdomain: "${CONNECTION_OPTIONS_HOSTS_ANONYMOUSDOMAIN}",
    },
    bosh: "${CONNECTION_OPTIONS_BOSH}",
    clientNode: "${CONNECTION_OPTIONS_CLIENTNODE}",
  }
}
