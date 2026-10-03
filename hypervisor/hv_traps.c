#include "hv_traps.h"
#include "hv_log.h"
#include "hv_audit_datpa.h"
#include <stdio.h>

static hv_vm_t *g_current_active_vm = NULL;

bool hv_traps_init(void) {
    hv_log_info("Trap and VMEXIT subsystem initializing: configuring IDT hooks and VMX/SVM intercept control");
    hv_audit_datpa_record_event(0, "TRAP_SYSTEM_READY", "IDT and VMCS trap handlers verified");
    return true;
}

void hv_traps_enter_guest(hv_vm_t *vm) {
    if (!vm) return;
    g_current_active_vm = vm;
    hv_log_debug("Entering guest VM %llu ('%s') via VMLAUNCH / VMRUN", 
                 (unsigned long long)vm->vm_id, vm->vm_name);

    // Simulated guest transition
    vm->executed_instructions += 256;
    
    // Periodically simulate a VMEXIT for scheduler / DATPA trace
    if (vm->executed_instructions % 512 == 0) {
        hv_traps_handle_vmexit();
    }
}

void hv_traps_handle_vmexit(void) {
    if (!g_current_active_vm) return;

    // Simulate standard exits: CPUID or HLT
    uint64_t fake_reason = (g_current_active_vm->executed_instructions % 1024 == 0) ? EXIT_REASON_CPUID : EXIT_REASON_HLT;
    
    hv_log_debug("VMEXIT on VM %llu: reason=%llu", 
                 (unsigned long long)g_current_active_vm->vm_id, 
                 (unsigned long long)fake_reason);

    hv_vm_handle_exit(g_current_active_vm, fake_reason);
}

void hv_traps_inject_interrupt(hv_vm_t *vm, uint8_t vector) {
    if (!vm) return;
    hv_log_debug("Injecting virtual interrupt vector %u into VM %llu", 
                 vector, (unsigned long long)vm->vm_id);
    hv_audit_datpa_record_event(vm->vm_id, "INTERRUPT_INJECT", "Virtual interrupt delivery");
}
