export const theRoles = [
    {
        role: 'admin',
        label: 'Administrador',
        text: 'Tiene todos los permisos sobre todas las acciones en la aplicación entera.'
    },
    {
        role: 'emisiones',
        label: 'Emisiones',
        text: 'Puede registrar, crear, cancelar, actualizar polizas y endosos para todas las compañías. Tiene acceso a reportes de polizas, endosos, siniestros, pagos, clientes, agentes y conductos.'
    },
    {
        role: 'finanzas',
        label: 'Finanzas',
        text: 'Puede actualizar, registrar y cancelar pagos, remesas y comisiones de las compañías, tiene acceso a reportes financieros y de estatus de las polizas por agente y conductos.'
    },
    {
        role: 'agente',
        label: 'Agente',
        text: 'Puede registrar, actualizar y ver sus propios asegurados y contactos y los de sus conductos, tiene acceso a reportes y estadísticas propias y de sus conductos de venta.'
    },
    {
        role: 'conducto',
        label: 'Conducto',
        text: 'Puede registrar, actualizar y ver sus propios asegurados y contactos, tiene acceso a reportes y estadísticas propias.'
    },
    {
        role: 'siniestros',
        label: 'Siniestros',
        text: 'Puede registrar, actualizar y dar seguimiento a siniestros y sus estadísticas.'
    }
];