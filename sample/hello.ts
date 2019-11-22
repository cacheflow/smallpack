import world from './world';
import randrom from './random';
const hello = () => `hello ${world()} ${randrom()}`;

console.log(hello())
export default hello;