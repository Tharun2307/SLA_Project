package com.college.tickets.repository;

import com.college.tickets.model.DepartmentName;
import com.college.tickets.model.Ticket;
import com.college.tickets.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByRaisedByUserId(String raisedByUserId);

    List<Ticket> findByAssignedToUserId(String assignedToUserId);

    List<Ticket> findByCategory(DepartmentName category);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByCategoryAndStatus(DepartmentName category, TicketStatus status);

    List<Ticket> findByCategoryAndAssignedToUserIdIsNull(DepartmentName category);

    long countByCategory(DepartmentName category);

    long countByCategoryAndStatus(DepartmentName category, TicketStatus status);

    long countByStatus(TicketStatus status);
}
