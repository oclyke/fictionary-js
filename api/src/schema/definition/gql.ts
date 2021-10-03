/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import { gql } from 'apollo-server';

import fs = require('fs');
import path = require('path');

const schema = fs.readFileSync(path.resolve(__dirname, 'schema.gql'), 'utf8');

const schemaDefinition = gql`
${schema}
`;

export default schemaDefinition;
