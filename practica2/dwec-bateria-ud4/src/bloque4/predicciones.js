// 🔮 PREDICCIONES · Cambia cada undefined por lo que crees que da. Luego: ./bateria.sh comprobar 4
// Para las tres primeras:  class A { hola() { return "A"; } }
//                          class B extends A { hola() { return "B" + super.hola(); } }
export const predicciones = {
  p1: "BA", // new B().hola()
  p2: true, // new B() instanceof A
  p3: true, // Object.getPrototypeOf(B) === A
  p4: 2, // class X { constructor() { this.n = 1; } } class Y extends X { constructor() { super(); this.n++; } }; new Y().n
};
