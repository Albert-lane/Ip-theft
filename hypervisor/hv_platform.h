#pragma once
#include <stdint.h>
#include <stdbool.h>

// Intel VMX Definitions
#define IA32_FEATURE_CONTROL_MSR         0x3A
#define IA32_FEATURE_CONTROL_LOCK        (1 << 0)
#define IA32_FEATURE_CONTROL_VMXON_OUT   (1 << 2)
#define CR4_VMXE                         (1 << 13)

// ARM EL2 Definitions
#define HCR_EL2_VM                       (1ULL << 0)
#define HCR_EL2_SWIO                     (1ULL << 1)
#define HCR_EL2_IMO                      (1ULL << 3)
#define HCR_EL2_FMO                      (1ULL << 4)
#define HCR_EL2_AMO                      (1ULL << 5)

typedef enum {
    HV_ARCH_X86_64_INTEL_VMX = 1,
    HV_ARCH_X86_64_AMD_SVM   = 2,
    HV_ARCH_AARCH64_ARM_EL2  = 3,
    HV_ARCH_LANE_VM_ENCLAVE  = 4
} hv_arch_type_t;

bool hv_platform_early_init(void);
void hv_platform_start_secondary_cpus(void);
void hv_platform_idle(void);

uint64_t hv_platform_read_msr(uint32_t msr);
void hv_platform_write_msr(uint32_t msr, uint64_t value);

void hv_platform_enable_vm_extensions(void);
void hv_platform_disable_vm_extensions(void);

hv_arch_type_t hv_platform_get_arch(void);
uint64_t hv_platform_get_timestamp_cycles(void);
