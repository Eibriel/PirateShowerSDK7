import {
  Entity,
  engine,
  Transform,
  GltfContainer,
  Animator
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'


export function createBlob(pos:Vector3, rot:Vector3, spawner = true): Entity {
  const meshEntity = engine.addEntity()
  Transform.create(meshEntity, { position: pos, rotation: Quaternion.fromLookAt(Vector3.Zero(), rot) }) 

  GltfContainer.create(meshEntity, { 
    src: "models/blob.glb"  
  })

  Animator.create(meshEntity, {
    states:[{
        name: "in",
        clip: "in",
        playing: true,
        loop: false
      }
    ]
  })

  return meshEntity
}
