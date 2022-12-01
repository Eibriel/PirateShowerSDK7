import {
  engine,
  GltfContainer,
  Transform,
  Raycast,
  RaycastQueryType,
  RaycastResult,
  inputSystem,
  InputAction,
  PointerEventType,
  MeshRenderer,
  MeshCollider
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

import { createBlob } from './factory'

// export all the functions required to make the scene work
export * from '@dcl/sdk'


const cameraEntity = engine.addEntity()
Transform.create(cameraEntity, {})

const toolEntity = engine.addEntity()
GltfContainer.create(toolEntity, { 
  src: "models/destructor_blue.gltf" 
})
Transform.create(toolEntity, {
  parent: cameraEntity,
  scale: Vector3.create(0.1, 0.1, 0.1),
  position: Vector3.create(0.2, 0, 1),
  rotation: Quaternion.fromEulerDegrees(0, -100, 0)
})


const floorEntity = engine.addEntity()
MeshRenderer.setPlane(floorEntity)
MeshCollider.setPlane(floorEntity)
Transform.create(floorEntity, {
  position: Vector3.create(8, 0.02, 8),
  scale: Vector3.create(16, 16, 1),
  rotation: Quaternion.fromEulerDegrees(-90, 0, 0)
})


const rayEntity = engine.addEntity()

let ray_timestamp = 0;

engine.addSystem(() => {
  if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)){
    const CameraPos = Transform.get(engine.CameraEntity).position
    const CameraRot = Transform.get(engine.CameraEntity).rotation

    console.log("Send ray")
    Raycast.createOrReplace(rayEntity, {
      origin: CameraPos,
      direction: Vector3.rotate(Vector3.Forward(), CameraRot),
      maxDistance: 16,
      queryType: RaycastQueryType.RQT_HIT_FIRST
    })
  }

  if (RaycastResult.has(rayEntity)) {
    const rayResult = RaycastResult.get(rayEntity)
    if (rayResult && ray_timestamp != rayResult.timestamp) {
      if (rayResult.hits.length > 0) {
        const pos = rayResult.hits[0].position||Vector3.Zero()
        const rot = rayResult.hits[0].normalHit||Vector3.Zero()
        createBlob(pos, rot, false)
      }
      ray_timestamp = rayResult.timestamp;
    }
  }
  
  if (Transform.has(engine.CameraEntity)) { // && !Transform.has(cameraEntity)) {
    Transform.createOrReplace(cameraEntity, Transform.get(engine.CameraEntity))
  }

})