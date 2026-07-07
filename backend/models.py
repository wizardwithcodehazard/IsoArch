from pydantic import BaseModel, Field
from typing import List, Optional

class DrawingMeta(BaseModel):
    drawing_no: Optional[str] = Field(default="", description="Drawing Number")
    revision: Optional[str] = Field(default="", description="Revision Number")
    line_number: Optional[str] = Field(default="", description="Line Number")
    nps: Optional[str] = Field(default="", description="Nominal Pipe Size")
    material_class: Optional[str] = Field(default="", description="Material Class")
    service: Optional[str] = Field(default="", description="Service Type")

class MTOItem(BaseModel):
    item_no: int = Field(..., description="Sequential item number")
    category: str = Field(..., description="Category: PIPE, FITTING, FLANGE, VALVE, GASKET, BOLT, or SUPPORT")
    description: str = Field(..., description="Full engineering description")
    size_nps: str = Field(..., description="Nominal Pipe Size (inches). Reducers have two sizes")
    schedule_rating: Optional[str] = Field(default="", description="Wall thickness schedule or pressure class")
    material_spec: Optional[str] = Field(default="", description="ASTM/ASME material grade")
    end_type: Optional[str] = Field(default="", description="Connection type: BW, SW, THD, FLGD")
    quantity: int = Field(..., description="Count for discrete items, 1 for pipes (length handles pipe qty)")
    unit: str = Field(..., description="M for pipe, EA for discrete, SET for bolts")
    length_m: Optional[float] = Field(default=None, description="Total cut length, pipes only")
    confidence: float = Field(default=1.0, description="Confidence score 0.0 to 1.0")
    remarks: Optional[str] = Field(default="", description="Any relevant remarks")
    bounding_box: Optional[List[float]] = Field(default=None, description="[ymin, xmin, ymax, xmax] normalized coordinates 0.0-1.0 if detected")

class MTOSummary(BaseModel):
    total_pipe_length_m: float = 0.0
    fittings: int = 0
    flanges: int = 0
    valves: int = 0
    gaskets: int = 0
    bolt_sets: int = 0
    field_welds: int = 0

class MTOResult(BaseModel):
    drawing_meta: DrawingMeta
    items: List[MTOItem]
    summary: MTOSummary
    processed_image_base64: Optional[str] = Field(default=None, description="Base64 of the processed image (especially if converted from PDF)")
