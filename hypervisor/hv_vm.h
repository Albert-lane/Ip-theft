#pragma once
#include <stdint.h>
#include <stdbool.h>
#include "hv_mm.h"

#define HV_MAX_VCPUS 16

typedef enum {
    HV_VM_STATE_CREATED,
    HV_VM_STATE_RUNNING,
    HV_VM_STATE_PAUSED,
    HV_VM_STATE_HALTED,
    HV_VM_STATE_PROVENANCE_SEQUESTERED
} hv_vm_state_t;

typedef struct hv_vcpu {
    uint32_t vcpu_id;
    uint64_t rip;
    uint64_t rsp;
    uint64_t cr0;
    uint64_t cr3;
    uint64_t cr4;
    uint64_t rflags;
    uint64_t regs[16];
    bool active;
} hv_vcpu_t;

typedef struct hv_vm {
    uint64_t vm_id;
    char vm_name[64];
    hv_vm_state_t state;
    hv_page_table_t *pt_root;
    uint32_t allocated_cores;
    uint32_t allocated_threads;
    uint32_t vcpu_count;
    hv_vcpu_t vcpus[HV_MAX_VCPUS];
    uint64_t zaxis_memory_anchor;
    uint64_t exit_count;
    uint64_t executed_instructions;
    uint8_t cryptographic_hash[32];
    bool provenance_attested;
} hv_vm_t;

hv_vm_t *hv_vm_create_root(void);
hv_vm_t *hv_vm_create_guest(void);
hv_vm_t *hv_vm_create_guest_serial(uint64_t vm_id, const char *name, uint32_t cores, uint32_t threads);
bool hv_vm_start(hv_vm_t *vm);
bool hv_vm_pause(hv_vm_t *vm);
bool hv_vm_handle_exit(hv_vm_t *vm, uint64_t exit_reason);
void hv_vm_destroy(hv_vm_t *vm);

uint32_t hv_vm_get_total_active_vms(void);
