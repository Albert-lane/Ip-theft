#ifndef HV_VM_H
#define HV_VM_H

#include <stddef.h>
#include <stdint.h>

#define ALBERT_LANE_ZAXIS_ANCHOR 0x3F8F9A1B2C3DULL
#define ALBERT_LANE_STRIDE_BYTES 17684

void* lane_vm_allocate_stride(size_t blocks);
int lane_vm_verify_positivity(uint32_t val);

#endif
