angular.module(PKG.name + '.services')
  .factory('myServiceApi', function(myCdapUrl, $resource, myAuth, myHelpers) {

    var url = myCdapUrl.constructUrl,
        basepath = '/namespaces/:namespace/apps/:appId/services/:serviceId';

    return $resource(
      url({ _cdapPath: basepath }),
    {
      namespace: '@namespace',
      appId: '@appId',
      serviceId: '@mapreduceId',
      runId: '@runId'
    },
    {
      get: myHelpers.getConfig('GET', 'REQUEST', basepath),
      runs: myHelpers.getConfig('GET', 'REQUEST', basepath + '/runs', true),
      nextLogs: myHelpers.getConfig('GET', 'REQUEST', basepath + '/runs/:runId/logs/next', true),
      prevLogs: myHelpers.getConfig('GET', 'REQUEST', basepath + '/runs/:runId/logs/prev', true),
      runDetail: myHelpers.getConfig('GET', 'REQUEST', basepath + '/runs/:runId')
    });
  });
