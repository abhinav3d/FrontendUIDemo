import { View, Stage, useGLTF, PerspectiveCamera, Center, Float, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface ModelViewerProps {
  modelUrl?: string;
  className?: string;
  autoRotate?: boolean;
}

export default function ModelViewer({ 
  modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  className = "min-h-[400px]",
  autoRotate = false
}: ModelViewerProps) {
  return (
    <div className={`w-full h-full bg-neutral-100 dark:bg-neutral-900/50 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 relative group/viewer ${className}`}>
      <View className="absolute inset-0">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          <Stage environment="city" intensity={0.6} shadows={{ type: 'contact', opacity: 0.4, blur: 2 }}>
            <Center>
              <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Model url={modelUrl} />
              </Float>
            </Center>
          </Stage>
          <OrbitControls 
            makeDefault 
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
            enablePan={true}
            enableZoom={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </View>
      
      {/* Interaction Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover/viewer:opacity-100 transition-opacity pointer-events-none z-10">
        Rotate & Zoom
      </div>
      
      {/* Loading Overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-commerce border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Initializing Mesh...</p>
          </div>
        </div>
      }>
        <ModelLoadingTrigger url={modelUrl} />
      </Suspense>
    </div>
  );
}

function ModelLoadingTrigger({ url }: { url: string }) {
  useGLTF(url);
  return null;
}
