if (typeof require === 'function') {
  var Box2D = require('./lib/box2d');
}

var Box2dScene = (function (undefined) {
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

  var SCALE = 10;
  var VELOCITY = 180 / SCALE;

  var SWORD_MIN = -2.5 * Math.PI / 4;
  var SWORD_MAX = 0;
  var SHIELD_MIN = 0;
  var SHIELD_MAX = Math.PI / 2;

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

  function create_body (world, dude, verts, density) {
    var fixture, body_def, body;

    fixture = new b2FixtureDef;
    fixture.density = density || 1;
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

  function create_barrier (world, x, y, w, h) {
    var fixture, body_def, body;
    var type = b2Body.b2_dynamicBody;

    fixture = new b2FixtureDef;
    fixture.density = 1;
    fixture.friction = 0.5;
    fixture.restitution = 0.2;
    fixture.shape = new b2PolygonShape;
    fixture.shape.SetAsBox(w/SCALE/2, h/SCALE/2);

    body_def = new b2BodyDef;
    body_def.type = b2Body.b2_staticBody;
    body_def.position.x = x / SCALE;
    body_def.position.y = y / SCALE;

    body = world.CreateBody(body_def);
    body.CreateFixture(fixture);

    return body;
  }

  function create_joint (world, body, thing) {
    joint_def = new b2RevoluteJointDef;
    joint_def.Initialize(body, thing, body.GetPosition());
    return world.CreateJoint(joint_def);
  }

  function Detector (scene) {
    this.BeginContact = function (contact) {
      var a, b, sword_fixture;
      var sword_i, body_i;
      do {
        a = contact.GetFixtureA().GetBody().GetUserData();
        b = contact.GetFixtureB().GetBody().GetUserData();
        if (a && b && ((a.type === 'sword' && b.type === 'body') ||
                       (a.type === 'body'  && b.type === 'sword'))) {
          console.log(a, b);
        }
      } while (contact = contact.GetNext());
    };
  }

  Detector.prototype = new b2ContactListener;

  function Box2dScene (dudes, canvas) {
    var dude, body, sword, shield;

    this.world = new b2World(new b2Vec2(0, 0), false);
    this.dudes = dudes || [];
    this.bodies = [];
    this.swords = [];
    this.shields = [];

    create_barrier(this.world, 320, -250, 1140, 500);
    create_barrier(this.world, 320, 730, 1140, 500);
    create_barrier(this.world, -250, 240, 500, 980);
    create_barrier(this.world, 890, 240, 500, 980);

    for (var i = 0; i < this.dudes.length; ++i) {
      this.addDude(this.dudes[i]);
    }

    this.world.SetContactListener(new Detector(this));

    if (canvas) {
      this.context = canvas.getContext('2d');
      this.setup_drawing();
    }
    this.step();
  }

  Box2dScene.prototype.addDude = function (dude) {
    body = create_body(this.world, dude, body_verts);
    sword = create_body(this.world, dude, sword_verts, 0.001);
    shield = create_body(this.world, dude, shield_verts, 0.001);

    var i = this.bodies.push(body);
    this.swords.push(sword);
    this.shields.push(shield);

    body.SetUserData({type: 'body', i: i});
    sword.SetUserData({type: 'sword', i: i});
    shield.SetUserData({type: 'shield', i: i});

    create_joint(this.world, body, sword);
    create_joint(this.world, body, shield);
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

  Box2dScene.prototype.angle  = function (state, pos) {
    var dx, dy, dc, dir, sin;
    dx = state.mouse_x / SCALE - pos.x;
    dy = state.mouse_y / SCALE - pos.y;
    dc = Math.sqrt(dx * dx + dy * dy);
    dir = Math.asin(dy / dc) + Math.PI / 2;
    if (dx < 0) {
      dir = -dir;
    }
    return dir;
  }

  function angularVelocity (sword, old_angle, angle, min, max, vel_forward, vel_back, state) {
    var sword_angle = sword.GetAngle() - old_angle;
    sword.SetAngle(angle + sword_angle);
    if (state) {
      if (sword_angle < max) {
        sword.SetAngularVelocity(vel_forward);
      } else {
        sword.SetAngle(angle + max);
        sword.SetAngularVelocity(0);
      }
    } else {
      if (sword_angle > min) {
        sword.SetAngularVelocity(-vel_back);
      } else {
        sword.SetAngle(angle + min);
        sword.SetAngularVelocity(0);
      }
    }
  }

  Box2dScene.prototype.update = function (states) {
    var state, sword, shield, body, velocity, angle, old_angle, sword_angle;
    for (var i = 0; i < states.length; ++i) {
      state = states[i];
      sword = this.swords[i]
      body = this.bodies[i];
      shield = this.shields[i];

      // No action when both mouse button down
      if (state.fight && state.dodge) {
        state.fight = false;
        state.dodge = false;
      }

      old_angle = body.GetAngle();
      angle = this.angle(state, body.GetPosition());
      body.SetAngle(angle);

      angularVelocity(shield, old_angle, angle, SHIELD_MIN, SHIELD_MAX, 15, 20, state.dodge);
      angularVelocity(sword, old_angle, angle, SWORD_MIN, SWORD_MAX, 15, 20, !state.fight);

      velocity = new b2Vec2(0, 0);

      if (state.up)    velocity.y = -VELOCITY;
      if (state.down)  velocity.y =  VELOCITY;
      if (state.left)  velocity.x = -VELOCITY;
      if (state.right) velocity.x =  VELOCITY;

      this.bodies[i].SetLinearVelocity(velocity);
    }
  };

  Box2dScene.prototype.step = function () {
    this.world.Step(1/60, 20, 20);
    this.world.DrawDebugData();
    this.world.ClearForces();

    var pos, body, values;
    var bodies_update = [];
    for (var i = 0; i < this.bodies.length; ++i) {
      values = {};
      body = this.bodies[i];
      pos = body.GetPosition();
      values.x = pos.x * SCALE;
      values.y = pos.y * SCALE;
      values.dir = body.GetAngle();
      values.sword = this.swords[i].GetAngle() - values.dir;
      values.shield = this.shields[i].GetAngle() - values.dir;
      bodies_update.push(values);
    }

    return bodies_update;
  };

  return Box2dScene;
})();

if (typeof module !== 'undefined') {
   module.exports = Box2dScene;
}
