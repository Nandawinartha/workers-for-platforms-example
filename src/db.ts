// Copyright (c) 2022 Cloudflare, Inc.
// Licensed under the APACHE LICENSE, VERSION 2.0 license found in the LICENSE file or at http://www.apache.org/licenses/LICENSE-2.0

import { D1QB, FetchTypes } from 'workers-qb';
import { Customer, CustomerToken, ResourceRecord, DispatchLimits, OutboundWorker, User, Project, Deployment } from './types';
import { ResultOne } from 'workers-qb/dist/types/interfaces';

export async function Initialize(db: D1QB) {
  const tables: { name: string; schema: string }[] = [
    {
      name: 'customers',
      schema: 'id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, plan_type TEXT NOT NULL, avatar_url TEXT, github_id TEXT UNIQUE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP',
    },
    {
      name: 'customer_tokens',
      schema: 'token TEXT PRIMARY KEY, customer_id TEXT NOT NULL, expires_at DATETIME',
    },
    {
      name: 'projects',
      schema: 'id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, customer_id TEXT NOT NULL, status TEXT DEFAULT "active", last_deployment DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, domains TEXT, github_repo TEXT, build_command TEXT, output_directory TEXT',
    },
    {
      name: 'deployments',
      schema: 'id TEXT PRIMARY KEY, project_id TEXT NOT NULL, status TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, duration INTEGER, url TEXT, commit_hash TEXT, commit_message TEXT, logs TEXT',
    },
    {
      name: 'api_keys',
      schema: 'id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, name TEXT NOT NULL, key_hash TEXT NOT NULL, permissions TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, last_used DATETIME',
    },
    {
      name: 'domains',
      schema: 'id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, domain TEXT UNIQUE NOT NULL, project_id TEXT, status TEXT DEFAULT "pending", ssl_certificate TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
    },
    {
      name: 'dispatch_limits',
      schema: 'script_id TEXT PRIMARY KEY, cpuMs INTEGER, memory INTEGER',
    },
    {
      name: 'outbound_workers',
      schema: 'script_id TEXT PRIMARY KEY, outbound_script_id TEXT NOT NULL',
    },
  ];

  for (const table of tables) {
    await db.dropTable({
      tableName: table.name,
      ifExists: true,
    });
  }
  for (const table of tables) {
    await db.createTable({
      tableName: table.name,
      schema: table.schema,
      ifNotExists: true,
    });
  }

  await AddCustomer(db, {
    id: '559968cd-b048-4bbc-ba21-d12625fcee45',
    name: 'Customer 1',
    plan_type: 'basic',
  });

  await AddCustomer(db, {
    id: '2612b586-4799-42ff-8c44-d4841e1e70ed',
    name: 'Customer 2',
    plan_type: 'advanced',
  });

  await AddCustomerToken(db, {
    token: 'a1b2c3',
    customer_id: '559968cd-b048-4bbc-ba21-d12625fcee45',
  });

  await AddCustomerToken(db, {
    token: 'd4e5f6',
    customer_id: '2612b586-4799-42ff-8c44-d4841e1e70ed',
  });
}

export async function AddCustomer(db: D1QB, customer: Customer) {
  return db.insert({
    tableName: 'customers',
    data: customer as unknown as Record<string, string>,
  });
}

export async function AddCustomerToken(db: D1QB, token: CustomerToken) {
  return db.insert({
    tableName: 'customer_tokens',
    data: token as unknown as Record<string, string>,
  });
}

export async function FetchTable(db: D1QB, table: string): Promise<ResourceRecord[] | undefined> {
  return (
    await db.fetchAll({
      tableName: table,
      fields: '*',
    })
  ).results;
}

export async function GetCustomerFromToken(db: D1QB, token: string): Promise<Customer> {
  return (await db.execute({
    query: `
      SELECT
        customers.id,
        customers.name,
        customers.plan_type
      FROM
        customer_tokens
      JOIN customers ON
        customers.id = customer_tokens.customer_id
      WHERE
        customer_tokens.token IS ?
    `,
    arguments: [token],
    fetchType: FetchTypes.ONE,
  })) as Customer;
}

export async function AddDispatchLimits(db: D1QB, dispatchLimits: DispatchLimits) {
  return db.insert({
    tableName: 'dispatch_limits',
    data: dispatchLimits as unknown as Record<string, string>,
  });
}

export async function GetDispatchLimitFromScript(db: D1QB, scriptName: string): Promise<ResultOne> {
  return await db.fetchOne({
    tableName: 'dispatch_limits',
    fields: '*',
    where: {
      conditions: 'dispatch_limits.script_id IS ?',
      params: [scriptName],
    },
  });
}

export async function AddOutboundWorker(db: D1QB, outboundWorker: OutboundWorker) {
  return db.insert({
    tableName: 'outbound_workers',
    data: outboundWorker as unknown as Record<string, string>,
  });
}

export async function GetOutboundWorkerFromScript(db: D1QB, scriptName: string): Promise<ResultOne> {
  return await db.fetchOne({
    tableName: 'outbound_workers',
    fields: '*',
    where: {
      conditions: 'outbound_workers.script_id IS ?',
      params: [scriptName],
    },
  });
}

// User Management Functions
export async function CreateUser(db: D1QB, user: Partial<User>): Promise<ResultOne> {
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  return db.insert({
    tableName: 'customers',
    data: {
      id: userId,
      name: user.name || '',
      email: user.email || '',
      plan_type: user.plan_type || 'starter',
      avatar_url: user.avatar_url || null,
      github_id: user.github_id || null,
      created_at: now,
      updated_at: now,
    },
  });
}

export async function GetUserByEmail(db: D1QB, email: string): Promise<User | null> {
  const result = await db.fetchOne({
    tableName: 'customers',
    fields: '*',
    where: {
      conditions: 'email = ?',
      params: [email],
    },
  });
  
  return result.results as User || null;
}

export async function GetUserByGithubId(db: D1QB, githubId: string): Promise<User | null> {
  const result = await db.fetchOne({
    tableName: 'customers',
    fields: '*',
    where: {
      conditions: 'github_id = ?',
      params: [githubId],
    },
  });
  
  return result.results as User || null;
}

export async function UpdateUser(db: D1QB, userId: string, updates: Partial<User>): Promise<ResultOne> {
  const now = new Date().toISOString();
  
  return db.update({
    tableName: 'customers',
    data: {
      ...updates,
      updated_at: now,
    },
    where: {
      conditions: 'id = ?',
      params: [userId],
    },
  });
}

// Project Management Functions
export async function CreateProject(db: D1QB, project: Partial<Project>): Promise<ResultOne> {
  const projectId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  return db.insert({
    tableName: 'projects',
    data: {
      id: projectId,
      name: project.name || '',
      description: project.description || null,
      customer_id: project.customer_id || '',
      status: project.status || 'active',
      created_at: now,
      updated_at: now,
      domains: JSON.stringify(project.domains || []),
      github_repo: project.github_repo || null,
      build_command: project.build_command || null,
      output_directory: project.output_directory || null,
    },
  });
}

export async function GetProjectsByCustomer(db: D1QB, customerId: string): Promise<Project[]> {
  const result = await db.fetchAll({
    tableName: 'projects',
    fields: '*',
    where: {
      conditions: 'customer_id = ?',
      params: [customerId],
    },
    orderBy: 'created_at DESC',
  });
  
  return (result.results as any[]).map(row => ({
    ...row,
    domains: JSON.parse(row.domains || '[]'),
  })) as Project[];
}

export async function GetProjectById(db: D1QB, projectId: string): Promise<Project | null> {
  const result = await db.fetchOne({
    tableName: 'projects',
    fields: '*',
    where: {
      conditions: 'id = ?',
      params: [projectId],
    },
  });
  
  if (!result.results) return null;
  
  const row = result.results as any;
  return {
    ...row,
    domains: JSON.parse(row.domains || '[]'),
  } as Project;
}

export async function UpdateProject(db: D1QB, projectId: string, updates: Partial<Project>): Promise<ResultOne> {
  const now = new Date().toISOString();
  const data: any = {
    ...updates,
    updated_at: now,
  };
  
  if (updates.domains) {
    data.domains = JSON.stringify(updates.domains);
  }
  
  return db.update({
    tableName: 'projects',
    data,
    where: {
      conditions: 'id = ?',
      params: [projectId],
    },
  });
}

export async function DeleteProject(db: D1QB, projectId: string): Promise<ResultOne> {
  return db.delete({
    tableName: 'projects',
    where: {
      conditions: 'id = ?',
      params: [projectId],
    },
  });
}

// Deployment Management Functions
export async function CreateDeployment(db: D1QB, deployment: Partial<Deployment>): Promise<ResultOne> {
  const deploymentId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  return db.insert({
    tableName: 'deployments',
    data: {
      id: deploymentId,
      project_id: deployment.project_id || '',
      status: deployment.status || 'building',
      created_at: now,
      duration: deployment.duration || null,
      url: deployment.url || null,
      commit_hash: deployment.commit_hash || null,
      commit_message: deployment.commit_message || null,
      logs: deployment.logs || null,
    },
  });
}

export async function GetDeploymentsByProject(db: D1QB, projectId: string, limit: number = 10): Promise<Deployment[]> {
  const result = await db.fetchAll({
    tableName: 'deployments',
    fields: '*',
    where: {
      conditions: 'project_id = ?',
      params: [projectId],
    },
    orderBy: 'created_at DESC',
    limit,
  });
  
  return result.results as Deployment[];
}

export async function GetDeploymentById(db: D1QB, deploymentId: string): Promise<Deployment | null> {
  const result = await db.fetchOne({
    tableName: 'deployments',
    fields: '*',
    where: {
      conditions: 'id = ?',
      params: [deploymentId],
    },
  });
  
  return result.results as Deployment || null;
}

export async function UpdateDeployment(db: D1QB, deploymentId: string, updates: Partial<Deployment>): Promise<ResultOne> {
  return db.update({
    tableName: 'deployments',
    data: updates,
    where: {
      conditions: 'id = ?',
      params: [deploymentId],
    },
  });
}
