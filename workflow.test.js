const test=require('node:test');const assert=require('node:assert/strict');
const transitions={'Submitted':['Assigned','In Progress'],'Assigned':['In Progress','Pending Information'],'In Progress':['Pending Information','Resolved'],'Pending Information':['In Progress','Resolved'],'Resolved':['Closed'],'Closed':[]};
test('closed requests cannot be directly moved to in progress',()=>assert.equal((transitions.Closed||[]).includes('In Progress'),false));
test('submitted requests can be assigned',()=>assert.equal(transitions.Submitted.includes('Assigned'),true));
test('resolved requests can be closed',()=>assert.equal(transitions.Resolved.includes('Closed'),true));
