/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { RedisManagementClient } from "@azure/arm-rediscache";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * This sample demonstrates how to Gets all patch schedules in the specified redis cache (there is only one).
 *
 * @summary Gets all patch schedules in the specified redis cache (there is only one).
 * x-ms-original-file: specification/redis/resource-manager/Microsoft.Cache/stable/2022-06-01/examples/RedisCachePatchSchedulesList.json
 */
async function redisCachePatchSchedulesList() {
  const subscriptionId = "subid";
  const resourceGroupName = "rg1";
  const cacheName = "cache1";
  const credential = new DefaultAzureCredential();
  const client = new RedisManagementClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.patchSchedules.listByRedisResource(
    resourceGroupName,
    cacheName
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

redisCachePatchSchedulesList().catch(console.error);
