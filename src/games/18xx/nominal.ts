/**
 * Brand and Flavor can be used for nominal typing.
 * This allows two otherwise compatible types to be distinguished.
 * Source: https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/
 * Source: https://gist.github.com/dcolthorp/aa21cf87d847ae9942106435bf47565d
 * Source: https://github.com/maxvst/typescript-tricks
 */

/** Used by Brand to mark a type in a readable way. */
interface Branding<BrandT> {
  _type: BrandT;
}

/** Create a "branded" version of a type.
 * TypeScript won't allow implicit conversion to this type
 * */
export type Brand<T, BrandT> = T & Branding<BrandT>;

/** Used by Flavor to mark a type in a readable way. */
interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
  
/** Create a "flavored" version of a type.
 * TypeScript will disallow mixing flavors, but will allow unflavored values of
 * that type to be passed in where a flavored version is expected. This is a
 * less restrictive form of branding.
 * */
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

