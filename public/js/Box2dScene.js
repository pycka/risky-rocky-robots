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

  var SCALE = 32;
  var VELOCITY = 180 / SCALE;

  var SWORD_MIN = -2.5 * Math.PI / 4;
  var SWORD_MAX = 0;
  var SHIELD_MIN = 0;
  var SHIELD_MAX = Math.PI / 2;

  var body_verts = {
    w: 35, h: 20, x: 0, y: 0
  };

  var sword_verts = {
    w: 60, h: 16, x: 53, y: 0
  };

  var shield_verts = {
    w: 10, h: 60, x: -22, y: 0
  };

  function create_body (world, dude, verts, density) {
    var fixture, body_def, body;

    fixture = new b2FixtureDef;
    fixture.density = density || 1;
    fixture.friction = 0.1;
    fixture.restitution = 0;
    // fixture.shape = polygon(verts);
    fixture.shape = new b2PolygonShape;
    fixture.shape.SetAsBox(verts.w / SCALE / 2, verts.h / SCALE / 2);

    body_def = new b2BodyDef;
    body_def.type = b2Body.b2_dynamicBody;
    body_def.position.x = (dude.x + verts.x) / SCALE;
    body_def.position.y = (dude.y + verts.y) / SCALE;
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
    fixture.restitution = 0;
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

  function create_joint (world, body, thing1, thing2) {
    joint_def = new b2RevoluteJointDef;
    joint_def.Initialize(thing1, thing2, body.GetPosition());
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

    create_joint(this.world, body, body, sword);
    create_joint(this.world, body, body, shield);
    create_joint(this.world, body, sword, shield);
  }

  Box2dScene.prototype.setup_drawing = function () {
    var dd = new b2DebugDraw;
    dd.SetSprite(this.context);
    dd.SetDrawScale(SCALE);
    dd.SetFillAlpha(0.4);
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
    this.world.Step(1/60, 10, 10);
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

  Box2dScene.prototype.redraw = function () {
    this.world.DrawDebugData();
  }

  return Box2dScene;
})();

if (typeof module !== 'undefined') {
   module.exports = Box2dScene;
}
