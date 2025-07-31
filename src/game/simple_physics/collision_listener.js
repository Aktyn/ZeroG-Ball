//@ts-check

//abstract class
export default class CollisionListener {
  constructor() {}

  /**
   *	@param {import('./body').Body} _A
   *	@param {import('./body').Body} _B
   */
  onCollision(_A, _B) {
    throw new Error("Method must be implemented in child class")
  }
}
