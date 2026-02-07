import bpy
import os

def create_3d_logo(svg_path, output_path, thickness=0.2):
    # Pulisci la scena
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    # Importa l'SVG
    bpy.ops.import_curve.svg(filepath=svg_path)
    
    # Seleziona tutte le curve importate
    imported_curves = [obj for obj in bpy.context.scene.objects if obj.type == 'CURVE']
    
    for curve in imported_curves:
        # Imposta l'estrusione (spessore)
        curve.data.extrude = thickness
        # Aggiungi un piccolo smusso (bevel) per catturare la luce
        curve.data.bevel_depth = 0.01
        
        # Converti in mesh se necessario per esportazione
        # bpy.ops.object.convert(target='MESH')
        
    # Salva il file .blend
    bpy.ops.wm.save_as_mainfile(filepath=output_path)

# Esempio di utilizzo (da eseguire dentro Blender)
# svg_file = "C:/path/to/eyegonal-yinyang.svg"
# blend_file = "C:/path/to/eyegonal-3d.blend"
# create_3d_logo(svg_file, blend_file)
