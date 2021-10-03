/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import { v4 as uuidv4 } from 'uuid';

/*
note: currently using uuidv4 to avoid any risk of application topology
leakage. however - this may not be necessary since cloud deployment
would help anonymize uuid generating machines and protect the
infrastructure.
*/
const getUUID = () => uuidv4();

export default getUUID;
