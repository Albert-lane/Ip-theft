#pragma once
#include <stdint.h>
#include <stdbool.h>
#include "hv_vm.h"

// Trap and VMEXIT Reason Enums
#define EXIT_REASON_EXCEPTION_NMI      0
#define EXIT_REASON_EXTERNAL_INTERRUPT 1
#define EXIT_REASON_TRIPLE_FAULT       2
#define EXIT_REASON_CPUID              10
#define EXIT_REASON_HLT                12
#define EXIT_REASON_VMCALL             18
#define EXIT_REASON_CR_ACCESS          28
#define EXIT_REASON_IO_INSTRUCTION     30
#define EXIT_REASON_RDMSR              31
#define EXIT_REASON_WRMSR              32
#define EXIT_REASON_EPT_VIOLATION      48

bool hv_traps_init(void);
void hv_traps_enter_guest(hv_vm_t *vm);
void hv_traps_handle_vmexit(void);
void hv_traps_inject_interrupt(hv_vm_t *vm, uint8_t vector);
