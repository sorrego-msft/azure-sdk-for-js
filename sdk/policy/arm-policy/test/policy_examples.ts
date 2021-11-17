/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  env,
  record,
  RecorderEnvironmentSetup,
  Recorder,
  delay,
  isPlaybackMode
} from "@azure-tools/test-recorder";
import * as assert from "assert";
import { ClientSecretCredential } from "@azure/identity";
import { PolicyClient } from "../src/policyClient";

const recorderEnvSetup: RecorderEnvironmentSetup = {
  replaceableVariables: {
    AZURE_CLIENT_ID: "azure_client_id",
    AZURE_CLIENT_SECRET: "azure_client_secret",
    AZURE_TENANT_ID: "88888888-8888-8888-8888-888888888888",
    SUBSCRIPTION_ID: "azure_subscription_id"
  },
  customizationsOnRecordings: [
    (recording: any): any =>
      recording.replace(
        /"access_token":"[^"]*"/g,
        `"access_token":"access_token"`
      )
  ],
  queryParametersToSkip: []
};

export const testPollingOptions = {
  updateIntervalInMs: isPlaybackMode() ? 0 : undefined,
};

describe("Policy test", () => {
  let recorder: Recorder;
  let subscriptionId: string;
  let client: PolicyClient;
  let location: string;
  let resourceGroupName: string;
  let policyName: string;
  let groupId: string;
  let policyAssignmentName: string;
  let scope: string;

  beforeEach(async function() {
    recorder = record(this, recorderEnvSetup);
    subscriptionId = env.SUBSCRIPTION_ID;
    // This is an example of how the environment variables are used
    const credential = new ClientSecretCredential(
      env.AZURE_TENANT_ID,
      env.AZURE_CLIENT_ID,
      env.AZURE_CLIENT_SECRET
    );
    client = new PolicyClient(credential, subscriptionId);
    location = "eastus";
    resourceGroupName = "myjstest";
    policyName = "policynameaxx";
    groupId = "20000000-0001-0000-0000-000000000123";
    policyAssignmentName = "passigment";
    scope ="/providers/Microsoft.Management/managementgroups/20000000-0001-0000-0000-000000000123/";
  });

  afterEach(async function() {
    await recorder.stop();
  });

  //policyDefinitions.createOrUpdateAtManagementGroup
  async function policyDefinitions_createOrUpdateAtManagementGroup() {
    const definition = await client.policyDefinitions.createOrUpdateAtManagementGroup(policyName,groupId,{
      policyType: "Custom",
      description: "Don't create a VM anywhere",
      policyRule: {
        if: {
          allof: [
            {
              source: "action",
              equals: "Microsoft.Compute/virtualMachines/write",
            },
            {
              field: "location",
              in: ["eastus", "eastus2", "centralus"],
            },
          ],
        },
        then: {
          effect: "deny",
        },
      }
    });
    console.log(definition);
  }

  it("policyAssignments create test", async function() {
    await policyDefinitions_createOrUpdateAtManagementGroup();
    const definition = await client.policyDefinitions.getAtManagementGroup(policyName,groupId);
    const res = await client.policyAssignments.create(scope,policyAssignmentName,{ policyDefinitionId: definition.id });
    assert.equal(res.name,policyAssignmentName);
  });

  it("policyAssignments get test", async function() {
    const res = await client.policyAssignments.get(scope,policyAssignmentName)
    assert.equal(res.name,policyAssignmentName);
  });

  it("policyAssignments list test", async function() {
    const resArray = new Array();
    for await (const item of client.policyAssignments.list()) {
      resArray.push(item);
    }
    assert.notEqual(resArray.length,0);
  });

  it("policyAssignments delete test", async function() {
    const res = await client.policyAssignments.delete(scope,policyAssignmentName);
    const resArray = new Array();
    for await (const item of client.policyAssignments.list()) {
      resArray.push(item);
    }
    assert.notEqual(resArray.length,0);
  });
});
