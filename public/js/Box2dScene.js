var Box2dScene = (function (window, document, undefined) {
  var b2World            = Box2D.Dynamics.b2World;
  var b2Vec2             = Box2D.Common.Math.b2Vec2;
  var b2Fixture          = Box2D.Dynamics.b2Fixture;
  var b2FixtureDef       = Box2D.Dynamics.b2FixtureDef;
  var b2Body             = Box2D.Dynamics.b2Body;
  var b2BodyDef          = Box2D.Dynamics.b2BodyDef;
  var b2ContactListener  = Box2D.Dynamics.b2ContactListener;
  var b2DebugDraw        = Box2D.Dynamics.b2DebugDraw;
  var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
  var b2PolygonShape     = Box2D.Collision.Shapes.b2PolygonShape;

  var SCALE = 32;

  var body_verts = [
    [-15, 10],
    [15, 10],
    [20, 3],
    [20, -5],
    [4, -16],
    [-4, -16],
    [-20, -5],
    [-20, 3]
  ];

  var sword_verts = [
    [0, 0],
    [23, -5],
    [76, -5],
    [84, 8],
    [23, 5],
  ];

  var shield_verts = [
    [-23, -30],
    [-32, -10],
    [-32, 10],
    [-23, 30],
    [-23, 5],
    [0, 0],
    [-23, -5]
  ];

  function polygon (verts) {
    var vec;
    var shape = new b2PolygonShape;

    var converted = [];
    for (var i = 0; i < verts.length; ++i) {
      vec = new b2Vec2;
      vec.Set(verts[i][0] / SCALE, verts[i][1] / SCALE);
      converted.push(vec);
    }

    shape.SetAsArray(converted, converted.length);
    return shape;
  }

  function create_body (world, dude, verts) {
    var fixture, body_def, body;
    fixture = new b2FixtureDef;
    fixture.density = 1;
    fixture.friction = 0.5;
    fixture.restitution = 0.2;
    fixture.shape = polygon(verts);

    body_def = new b2BodyDef;
    body_def.type = b2Body.b2_dynamicBody;
    body_def.position.x = dude.x / SCALE;
    body_def.position.y = dude.y / SCALE;
    body_def.angle = dude.dir;

    body = world.CreateBody(body_def);
    body.CreateFixture(fixture);

    return body;
  }

  function create_joint (world, body, thing) {
    joint_def = new b2RevoluteJointDef;
    joint_def.Initialize(body, thing, body.GetPosition());
    return world.CreateJoint(joint_def);
  }

  function Box2dScene (dudes, canvas) {
    var dude, body, sword, shield, sword_joint_def, shield_joint_def;

    this.context = canvas.getContext('2d');
    this.world = new b2World(new b2Vec2(0, 0), true);
    this.bodies = [];
    this.swords = [];
    this.shields = [];

    for (var i = 0; i < dudes.length; ++i) {
      dude = dudes[i];

      body = create_body(this.world, dude, body_verts);
      sword = create_body(this.world, dude, sword_verts);
      shield = create_body(this.world, dude, shield_verts);

      this.bodies.push(body);
      this.swords.push(sword);
      this.shields.push(shield);

      create_joint(this.world, body, sword);
      create_joint(this.world, body, shield);
    }

    this.step();
    this.setup_drawing();
  }

  Box2dScene.prototype.setup_drawing = function () {
    var dd = new b2DebugDraw;
    dd.SetSprite(this.context);
    dd.SetDrawScale(SCALE);
    dd.SetFillAlpha(1);
    dd.SetLineThickness(1.0);
    dd.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(dd);
  };

  Box2dScene.prototype.update = function (states) {
    var state;
    for (var i = 0; i < states.length; ++i) {
      state = states[i];
      this.bodies[i].SetAngle(state.dir);
      this.swords[i].SetAngle(state.dir);
      this.shields[i].SetAngle(state.dir);
    }
  };

  Box2dScene.prototype.step = function () {
    this.world.Step(1/60, 10, 10);
    this.world.DrawDebugData();
    this.world.ClearForces();
  };

  return Box2dScene;
})(window, document);
